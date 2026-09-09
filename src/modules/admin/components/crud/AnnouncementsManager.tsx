import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Announcement } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateAnnouncementForm } from '../../schemas';
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
} from './index';

interface AnnouncementFormData {
  title: string;
  message: string;
  priority: Announcement['priority'];
  targetAudience: Announcement['targetAudience'];
  expiresAt: string; // YYYY-MM-DD
  isArchived: boolean;
}

const INITIAL_FORM_DATA: AnnouncementFormData = {
  title: '',
  message: '',
  priority: 'high',
  targetAudience: 'all',
  expiresAt: '',
  isArchived: false,
};

const PRIORITY_BADGES: Record<Announcement['priority'], string> = {
  urgent: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
  high: 'bg-amber-100 text-amber-900 border-amber-300',
  medium: 'bg-blue-100 text-blue-900 border-blue-200',
  low: 'bg-slate-100 text-slate-700 border-slate-200',
};

const AUDIENCE_LABELS: Record<Announcement['targetAudience'], string> = {
  all: 'Entire Community (Public)',
  members: 'Registered Members',
  core_team: 'Core Leadership Team',
};

export const AnnouncementsManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Delete Confirmation State
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // Auto-dismiss success notification
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.priority.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesAudience = audienceFilter === 'all' || item.targetAudience === audienceFilter;

      const isArchived = item.isArchived;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !isArchived) ||
        (statusFilter === 'archived' && isArchived);

      return matchesSearch && matchesPriority && matchesAudience && matchesStatus;
    });
  }, [announcements, searchQuery, priorityFilter, audienceFilter, statusFilter]);

  const isFiltered =
    searchQuery !== '' ||
    priorityFilter !== 'all' ||
    audienceFilter !== 'all' ||
    statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setAudienceFilter('all');
    setStatusFilter('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingAnnouncement(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Announcement) => {
    setEditingAnnouncement(item);
    setFormData({
      title: item.title,
      message: item.message,
      priority: item.priority,
      targetAudience: item.targetAudience,
      expiresAt: item.expiresAt ? item.expiresAt.split('T')[0] : '',
      isArchived: item.isArchived,
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setFormErrors({});
    setModalApiError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    // Validate using pure TypeScript schema validator
    const validation = validateAnnouncementForm({
      title: formData.title,
      message: formData.message,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const expiresAtIso = formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined;

    try {
      if (editingAnnouncement) {
        // Update existing announcement
        await adminRepository.updateAnnouncement(editingAnnouncement.id, {
          title: formData.title.trim(),
          message: formData.message.trim(),
          priority: formData.priority,
          targetAudience: formData.targetAudience,
          expiresAt: expiresAtIso,
          isArchived: formData.isArchived,
        });
        setSuccessMessage(`Announcement "${formData.title}" updated.`);
      } else {
        // Create new announcement broadcast
        await adminRepository.createAnnouncement({
          title: formData.title.trim(),
          message: formData.message.trim(),
          priority: formData.priority,
          targetAudience: formData.targetAudience,
          expiresAt: expiresAtIso,
          isArchived: formData.isArchived,
        });
        setSuccessMessage(`Announcement "${formData.title}" broadcasted successfully.`);
      }

      setIsModalOpen(false);
      await loadAnnouncements();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save announcement');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Toggle Active / Archive Status Handler
  // --------------------------------------------------------------------------
  const handleToggleArchive = async (item: Announcement) => {
    const nextArchived = !item.isArchived;
    try {
      await adminRepository.updateAnnouncement(item.id, { isArchived: nextArchived });
      setSuccessMessage(
        nextArchived
          ? `Announcement "${item.title}" moved to archive.`
          : `Announcement "${item.title}" reactivated.`
      );
      await loadAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update broadcast status');
    }
  };

  // --------------------------------------------------------------------------
  // Delete Announcement Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (item: Announcement) => {
    setAnnouncementToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteAnnouncement(announcementToDelete.id);
      setSuccessMessage(`Announcement "${announcementToDelete.title}" deleted.`);
      setAnnouncementToDelete(null);
      await loadAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete announcement');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<Announcement>[] = [
    {
      key: 'title',
      header: 'Broadcast Message',
      render: (item) => (
        <div className="max-w-md">
          <div className="flex items-center space-x-2">
            <div className="font-bold text-slate-900 truncate" title={item.title}>
              {item.title}
            </div>
          </div>
          <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
            {item.message}
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (item) => (
        <span
          className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider border ${
            PRIORITY_BADGES[item.priority]
          }`}
        >
          {item.priority === 'urgent' && (
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping mr-1" />
          )}
          <span>{item.priority}</span>
        </span>
      ),
    },
    {
      key: 'targetAudience',
      header: 'Target Audience',
      render: (item) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200">
          {AUDIENCE_LABELS[item.targetAudience]}
        </span>
      ),
    },
    {
      key: 'schedule',
      header: 'Broadcast Timeline',
      render: (item) => (
        <div className="text-[11px]">
          <div className="text-slate-800">
            <span className="text-slate-400">Sent:</span>{' '}
            {new Date(item.startsAt).toLocaleDateString()}
          </div>
          <div className="text-slate-500">
            <span className="text-slate-400">Expires:</span>{' '}
            {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : 'No expiry'}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const isActive = !item.isArchived;
        return (
          <button
            type="button"
            onClick={() => handleToggleArchive(item)}
            title="Click to toggle active / archived status"
            className={`inline-flex items-center space-x-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span>{isActive ? 'Active' : 'Archived'}</span>
          </button>
        );
      },
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
            onClick={loadAnnouncements}
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

      {/* Search & Filter Toolbar */}
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search announcements by title, message, or priority..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={announcements.length}
        filteredCount={filteredAnnouncements.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Broadcast Announcement"
      >
        {/* Priority Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="priority-filter" className="text-xs text-slate-600 font-medium">
            Priority:
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Audience Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="audience-filter" className="text-xs text-slate-600 font-medium">
            Audience:
          </label>
          <select
            id="audience-filter"
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Audiences</option>
            <option value="all">Entire Community</option>
            <option value="members">Members Only</option>
            <option value="core_team">Core Team Only</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="status-filter" className="text-xs text-slate-600 font-medium">
            Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </SearchFilterToolbar>

      {/* Announcements Data Table */}
      <CRUDTable
        data={filteredAnnouncements}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching announcements' : 'No announcements broadcasted'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or priority/audience filters.'
            : 'Send an alert or announcement to community members or leadership.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Create / Edit Announcement) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAnnouncement ? 'Edit Announcement Broadcast' : 'Create Broadcast Alert'}
        subtitle={
          editingAnnouncement
            ? `Modifying "${editingAnnouncement.title}"`
            : 'Publish a priority alert to student builders or core leadership'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingAnnouncement ? 'Update Announcement' : 'Publish Broadcast'}
        maxWidthClass="max-w-2xl"
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <FormField
              label="Announcement Title"
              htmlFor="ann-title"
              required
              error={formErrors.title}
            >
              <TextInput
                id="ann-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Registration Open for Autumn Cloud Bootcamp 2026"
                hasError={Boolean(formErrors.title)}
              />
            </FormField>
          </div>

          {/* Priority */}
          <FormField
            label="Priority Level"
            htmlFor="ann-priority"
            required
            error={formErrors.priority}
          >
            <Select
              id="ann-priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as AnnouncementFormData['priority'],
                })
              }
              hasError={Boolean(formErrors.priority)}
            >
              <option value="urgent">Urgent (Red Alert • Critical Notice)</option>
              <option value="high">High (Amber • Important Action Required)</option>
              <option value="medium">Medium (Blue • General Update)</option>
              <option value="low">Low (Slate • Informational)</option>
            </Select>
          </FormField>

          {/* Target Audience */}
          <FormField
            label="Target Audience"
            htmlFor="ann-audience"
            required
            error={formErrors.targetAudience}
          >
            <Select
              id="ann-audience"
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetAudience: e.target.value as AnnouncementFormData['targetAudience'],
                })
              }
              hasError={Boolean(formErrors.targetAudience)}
            >
              <option value="all">All Community (Public Broadcast)</option>
              <option value="members">Registered Members Only</option>
              <option value="core_team">Core Team Leadership Only</option>
            </Select>
          </FormField>

          {/* Expiration Date */}
          <FormField
            label="Expiration Date (Optional)"
            htmlFor="ann-expiry"
            hint="Leave blank for non-expiring notice"
          >
            <TextInput
              id="ann-expiry"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />
          </FormField>

          {/* Archive Status */}
          <FormField
            label="Lifecycle State"
            htmlFor="ann-archive"
            required
          >
            <Select
              id="ann-archive"
              value={formData.isArchived ? 'true' : 'false'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isArchived: e.target.value === 'true',
                })
              }
            >
              <option value="false">Active Broadcast (Live)</option>
              <option value="true">Archived (Deactivated)</option>
            </Select>
          </FormField>

          {/* Message Content */}
          <div className="sm:col-span-2">
            <FormField
              label="Announcement Message"
              htmlFor="ann-message"
              required
              error={formErrors.message}
              hint="Minimum 10 characters"
            >
              <TextArea
                id="ann-message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type the broadcast alert message details here..."
                hasError={Boolean(formErrors.message)}
              />
            </FormField>
          </div>
        </div>
      </FormModal>

      {/* Destructive Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(announcementToDelete)}
        onClose={() => setAnnouncementToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Announcement"
        itemTitle={announcementToDelete?.title}
        message="Are you sure you want to delete this broadcast? This will permanently remove it from member feeds."
        confirmLabel="Delete Announcement"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
