import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Event } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateEventForm } from '../../schemas';
import {
  CRUDTable,
  Column,
  FormModal,
  ConfirmDialog,
  SearchFilterToolbar,
  FormField,
  TextInput,
  TextArea,
  Select,
  MediaField,
} from './index';

interface EventFormData {
  title: string;
  description: string;
  category: Event['category'];
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  bannerUrl: string;
  registrationLink: string;
  capacity: string;
  status: Event['status'];
  academicYear: string;
}

const INITIAL_FORM_DATA: EventFormData = {
  title: '',
  description: '',
  category: 'workshop',
  date: '',
  time: '14:00 - 17:00 IST',
  location: '',
  isVirtual: false,
  bannerUrl: '',
  registrationLink: '',
  capacity: '60',
  status: 'upcoming',
  academicYear: '2025-2026',
};

const CATEGORY_LABELS: Record<Event['category'], string> = {
  workshop: 'Workshop',
  webinar: 'Webinar',
  hackathon: 'Hackathon',
  meetup: 'Meetup',
  study_group: 'Study Group',
};

const CATEGORY_BADGES: Record<Event['category'], string> = {
  workshop: 'bg-amber-100 text-amber-900 border-amber-200',
  webinar: 'bg-blue-100 text-blue-900 border-blue-200',
  hackathon: 'bg-rose-100 text-rose-900 border-rose-200',
  meetup: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  study_group: 'bg-purple-100 text-purple-900 border-purple-200',
};

const STATUS_BADGES: Record<Event['status'], string> = {
  upcoming: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const EventsManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Destructive / Archival Dialog State
  const [eventToArchive, setEventToArchive] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events calendar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Auto-dismiss success notification
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // --------------------------------------------------------------------------
  // Dynamic Academic Years Extraction
  // --------------------------------------------------------------------------
  const dynamicAcademicYears = useMemo(() => {
    const years = Array.from(new Set(events.map((e) => e.academicYear))).filter(Boolean);
    return years.sort().reverse();
  }, [events]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredEvents = useMemo(() => {
    return events.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesYear = academicYearFilter === 'all' || item.academicYear === academicYearFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesYear;
    });
  }, [events, searchQuery, categoryFilter, statusFilter, academicYearFilter]);

  const isFiltered =
    searchQuery !== '' ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    academicYearFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setAcademicYearFilter('all');
  };

  // --------------------------------------------------------------------------
  // Create / Edit Handlers
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      ...INITIAL_FORM_DATA,
      academicYear: academicYearFilter !== 'all' ? academicYearFilter : '2025-2026',
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      isVirtual: event.isVirtual,
      bannerUrl: event.bannerUrl || '',
      registrationLink: event.registrationLink || '',
      capacity: event.capacity ? String(event.capacity) : '',
      status: event.status,
      academicYear: event.academicYear,
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormErrors({});
    setModalApiError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    const parsedCapacity = formData.capacity.trim() !== '' ? parseInt(formData.capacity, 10) : undefined;

    // Validate using pure TypeScript schema validator
    const validation = validateEventForm({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      academicYear: formData.academicYear,
      bannerUrl: formData.bannerUrl || undefined,
      registrationLink: formData.registrationLink || undefined,
      capacity: parsedCapacity,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      if (editingEvent) {
        // Update existing event
        await adminRepository.updateEvent(editingEvent.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          date: formData.date,
          time: formData.time.trim(),
          location: formData.location.trim(),
          isVirtual: formData.isVirtual,
          bannerUrl: formData.bannerUrl.trim() || undefined,
          registrationLink: formData.registrationLink.trim() || undefined,
          capacity: parsedCapacity,
          status: formData.status,
          academicYear: formData.academicYear.trim(),
        });
        setSuccessMessage(`Event "${formData.title}" updated successfully.`);
      } else {
        // Create new event
        await adminRepository.createEvent({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          date: formData.date,
          time: formData.time.trim(),
          location: formData.location.trim(),
          isVirtual: formData.isVirtual,
          bannerUrl: formData.bannerUrl.trim() || undefined,
          registrationLink: formData.registrationLink.trim() || undefined,
          capacity: parsedCapacity,
          status: formData.status,
          academicYear: formData.academicYear.trim(),
          attendeesCount: 0,
        });
        setSuccessMessage(`Event "${formData.title}" scheduled successfully.`);
      }

      setIsModalOpen(false);
      await loadEvents();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Archival Handlers (Soft State Transition)
  // --------------------------------------------------------------------------
  const handleOpenArchiveDialog = (event: Event) => {
    setEventToArchive(event);
  };

  const handleConfirmArchive = async () => {
    if (!eventToArchive) return;

    setIsProcessingAction(true);
    try {
      await adminRepository.archiveEvent(eventToArchive.id);
      setSuccessMessage(`Event "${eventToArchive.title}" has been moved to historical archives.`);
      setEventToArchive(null);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive event');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // --------------------------------------------------------------------------
  // Permanent Deletion Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (event: Event) => {
    setEventToDelete(event);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setIsProcessingAction(true);
    try {
      await adminRepository.deleteEvent(eventToDelete.id);
      setSuccessMessage(`Event "${eventToDelete.title}" permanently removed.`);
      setEventToDelete(null);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<Event>[] = [
    {
      key: 'title',
      header: 'Event Details',
      render: (event) => (
        <div className="flex items-start space-x-3 max-w-sm">
          {event.bannerUrl ? (
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="h-10 w-14 rounded-md object-cover border border-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400 border border-slate-200">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-slate-900 truncate" title={event.title}>
              {event.title}
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {event.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (event) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
            CATEGORY_BADGES[event.category]
          }`}
        >
          {CATEGORY_LABELS[event.category]}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Schedule',
      render: (event) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">{event.date}</div>
          <div className="text-[11px] text-slate-500">{event.time}</div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Venue & Format',
      render: (event) => (
        <div className="max-w-[180px]">
          <div className="flex items-center space-x-1.5">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                event.isVirtual ? 'bg-cyan-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {event.isVirtual ? 'Virtual' : 'In-Person'}
            </span>
          </div>
          <div className="text-slate-700 text-[11px] truncate mt-0.5" title={event.location}>
            {event.location}
          </div>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Attendance / Capacity',
      render: (event) => {
        if (!event.capacity) return <span className="text-slate-400 text-[11px]">Open RSVP</span>;
        const registered = event.attendeesCount || 0;
        const percentage = Math.min(100, Math.round((registered / event.capacity) * 100));

        return (
          <div className="w-28 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-slate-800">{registered} / {event.capacity}</span>
              <span className="text-slate-500">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (event) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
            STATUS_BADGES[event.status]
          }`}
        >
          {event.status}
        </span>
      ),
    },
  ];

  // --------------------------------------------------------------------------
  // Render View
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-4">
      {/* Inline Global Error Banner */}
      {error && (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 flex items-start justify-between"
          role="alert"
        >
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-rose-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
          <button
            type="button"
            onClick={loadEvents}
            className="font-semibold text-rose-700 underline hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Inline Success Toast Banner */}
      {successMessage && (
        <div
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in-0 duration-200"
          role="status"
        >
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Search & Multi-Filter Toolbar */}
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search events by title, description, venue, or category..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={events.length}
        filteredCount={filteredEvents.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Schedule Event"
      >
        {/* Category Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="event-cat-filter" className="text-xs text-slate-600 font-medium">
            Category:
          </label>
          <select
            id="event-cat-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="workshop">Workshops</option>
            <option value="webinar">Webinars</option>
            <option value="hackathon">Hackathons</option>
            <option value="meetup">Meetups</option>
            <option value="study_group">Study Groups</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="event-status-filter" className="text-xs text-slate-600 font-medium">
            Status:
          </label>
          <select
            id="event-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Academic Year Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="event-year-filter" className="text-xs text-slate-600 font-medium">
            Batch:
          </label>
          <select
            id="event-year-filter"
            value={academicYearFilter}
            onChange={(e) => setAcademicYearFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 font-mono focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Batches</option>
            {dynamicAcademicYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </SearchFilterToolbar>

      {/* Events Data Table */}
      <CRUDTable
        data={filteredEvents}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching events found' : 'No events scheduled'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search terms or category/status filters.'
            : 'Get started by scheduling your first technical workshop or webinar.'
        }
        onEdit={handleOpenEditModal}
        onArchive={
          (event) => {
            if (event.status !== 'archived') {
              handleOpenArchiveDialog(event);
            }
          }
        }
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Schedule / Edit Event) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? 'Edit Community Event' : 'Schedule Community Event'}
        subtitle={
          editingEvent
            ? `Updating schedule and venue details for "${editingEvent.title}"`
            : 'Create and broadcast a technical workshop, hackathon, or webinar'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingEvent ? 'Update Event' : 'Schedule Event'}
        maxWidthClass="max-w-3xl"
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <FormField
              label="Event Title"
              htmlFor="event-title"
              required
              error={formErrors.title}
            >
              <TextInput
                id="event-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Hands-on Serverless Workshop: AWS Lambda & DynamoDB"
                hasError={Boolean(formErrors.title)}
              />
            </FormField>
          </div>

          {/* Category */}
          <FormField
            label="Event Category"
            htmlFor="event-category"
            required
            error={formErrors.category}
          >
            <Select
              id="event-category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as EventFormData['category'],
                })
              }
              hasError={Boolean(formErrors.category)}
            >
              <option value="workshop">Technical Workshop</option>
              <option value="webinar">Webinar / Tech Talk</option>
              <option value="hackathon">Hackathon</option>
              <option value="meetup">Community Meetup</option>
              <option value="study_group">Certification Study Group</option>
            </Select>
          </FormField>

          {/* Academic Year */}
          <FormField
            label="Academic Year"
            htmlFor="event-year"
            required
            error={formErrors.academicYear}
            hint="Format: YYYY-YYYY"
          >
            <TextInput
              id="event-year"
              type="text"
              required
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="e.g. 2025-2026"
              hasError={Boolean(formErrors.academicYear)}
            />
          </FormField>

          {/* Date */}
          <FormField
            label="Event Date"
            htmlFor="event-date"
            required
            error={formErrors.date}
          >
            <TextInput
              id="event-date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              hasError={Boolean(formErrors.date)}
            />
          </FormField>

          {/* Time */}
          <FormField
            label="Event Time"
            htmlFor="event-time"
            required
            error={formErrors.time}
            hint="e.g. 14:00 - 17:00 IST"
          >
            <TextInput
              id="event-time"
              type="text"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="14:00 - 17:00 IST"
              hasError={Boolean(formErrors.time)}
            />
          </FormField>

          {/* Location / Platform */}
          <FormField
            label="Venue / Meeting Location"
            htmlFor="event-location"
            required
            error={formErrors.location}
            hint="Physical hall or virtual platform (Zoom, Google Meet)"
          >
            <TextInput
              id="event-location"
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Lab 402, Technology Block or Google Meet"
              hasError={Boolean(formErrors.location)}
            />
          </FormField>

          {/* Virtual / Physical Toggle */}
          <FormField
            label="Event Format"
            htmlFor="event-virtual"
            required
          >
            <Select
              id="event-virtual"
              value={formData.isVirtual ? 'true' : 'false'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isVirtual: e.target.value === 'true',
                })
              }
            >
              <option value="false">In-Person (Campus Venue)</option>
              <option value="true">Virtual (Online Webinar / Stream)</option>
            </Select>
          </FormField>

          {/* Capacity */}
          <FormField
            label="Registration Capacity"
            htmlFor="event-capacity"
            error={formErrors.capacity}
            hint="Leave blank for unlimited RSVP"
          >
            <TextInput
              id="event-capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="e.g. 60"
              hasError={Boolean(formErrors.capacity)}
            />
          </FormField>

          {/* Status */}
          <FormField
            label="Event Lifecycle Status"
            htmlFor="event-status"
            required
          >
            <Select
              id="event-status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as EventFormData['status'],
                })
              }
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </Select>
          </FormField>

          {/* Registration Link */}
          <div className="sm:col-span-2">
            <FormField
              label="Registration Form / RSVP Link"
              htmlFor="event-reglink"
              error={formErrors.registrationLink}
            >
              <TextInput
                id="event-reglink"
                type="url"
                value={formData.registrationLink}
                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                placeholder="https://forms.google.com/... or event RSVP page"
                hasError={Boolean(formErrors.registrationLink)}
              />
            </FormField>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <FormField
              label="Event Description & Agenda"
              htmlFor="event-desc"
              required
              error={formErrors.description}
              hint="Minimum 10 characters"
            >
              <TextArea
                id="event-desc"
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed syllabus, key takeaways, speaker details, and prerequisites..."
                hasError={Boolean(formErrors.description)}
              />
            </FormField>
          </div>

          {/* Media Banner */}
          <div className="sm:col-span-2">
            <MediaField
              label="Event Banner Promotional Image URL"
              value={formData.bannerUrl}
              onChange={(url) => setFormData({ ...formData, bannerUrl: url })}
              error={formErrors.bannerUrl}
              placeholder="https://images.unsplash.com/... or CDN link"
              helperText="16:9 aspect ratio promotional banner URL or Cloudinary CDN asset link."
              previewHeightClass="h-32"
            />
          </div>
        </div>
      </FormModal>

      {/* Soft Archival Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(eventToArchive)}
        onClose={() => setEventToArchive(null)}
        onConfirm={handleConfirmArchive}
        title="Archive Community Event"
        itemTitle={eventToArchive?.title}
        message="Archiving will change this event's status to Archived. All historical records, dates, and attendee summaries will be preserved in the archive."
        confirmLabel="Archive Event"
        variant="warning"
        isProcessing={isProcessingAction}
      />

      {/* Destructive Permanent Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Event Record"
        itemTitle={eventToDelete?.title}
        message="Are you sure you want to permanently delete this event? This action will remove the event record from the system."
        confirmLabel="Delete Event"
        variant="danger"
        isProcessing={isProcessingAction}
      />
    </div>
  );
};
