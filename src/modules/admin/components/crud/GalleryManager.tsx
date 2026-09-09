import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { GalleryItem } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateGalleryForm } from '../../schemas';
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

interface GalleryFormData {
  title: string;
  description: string;
  imageUrl: string;
  eventName: string;
  date: string;
  category: GalleryItem['category'];
  isArchived: boolean;
}

const INITIAL_FORM_DATA: GalleryFormData = {
  title: '',
  description: '',
  imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
  eventName: '',
  date: new Date().toISOString().split('T')[0],
  category: 'workshops',
  isArchived: false,
};

const CATEGORY_LABELS: Record<GalleryItem['category'], string> = {
  events: 'Community Event',
  workshops: 'Technical Workshop',
  team: 'Core Team & Leads',
  hackathons: 'Hackathon & Demo Day',
  community: 'Builder Community',
};

const CATEGORY_BADGES: Record<GalleryItem['category'], string> = {
  events: 'bg-blue-100 text-blue-900 border-blue-200',
  workshops: 'bg-amber-100 text-amber-900 border-amber-200',
  team: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  hackathons: 'bg-purple-100 text-purple-900 border-purple-200',
  community: 'bg-indigo-100 text-indigo-900 border-indigo-200',
};

export const GalleryManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<GalleryFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadGalleryItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getGalleryItems();
      setGalleryItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load community gallery items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGalleryItems();
  }, [loadGalleryItems]);

  // Auto-dismiss success notification
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // --------------------------------------------------------------------------
  // Dynamic Events Extraction
  // --------------------------------------------------------------------------
  const dynamicEvents = useMemo(() => {
    const events = Array.from(
      new Set(galleryItems.map((g) => g.eventName).filter(Boolean))
    ) as string[];
    return events.sort();
  }, [galleryItems]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.eventName && item.eventName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      const isArchived = item.isArchived;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !isArchived) ||
        (statusFilter === 'archived' && isArchived);

      const matchesEvent = eventFilter === 'all' || item.eventName === eventFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesEvent;
    });
  }, [galleryItems, searchQuery, categoryFilter, statusFilter, eventFilter]);

  const isFiltered =
    searchQuery !== '' ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    eventFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setEventFilter('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      eventName: item.eventName || '',
      date: item.date,
      category: item.category,
      isArchived: item.isArchived,
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingItem(null);
    setFormErrors({});
    setModalApiError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    // Validate using pure TypeScript schema validator
    const validation = validateGalleryForm({
      title: formData.title,
      imageUrl: formData.imageUrl,
      category: formData.category,
      date: formData.date,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      if (editingItem) {
        // Update existing gallery item
        await adminRepository.updateGalleryItem(editingItem.id, {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          imageUrl: formData.imageUrl.trim(),
          eventName: formData.eventName.trim() || undefined,
          date: formData.date,
          category: formData.category,
          isArchived: formData.isArchived,
        });
        setSuccessMessage(`Gallery photo "${formData.title}" updated successfully.`);
      } else {
        // Create new gallery item
        await adminRepository.createGalleryItem({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          imageUrl: formData.imageUrl.trim(),
          eventName: formData.eventName.trim() || undefined,
          date: formData.date,
          category: formData.category,
          isArchived: formData.isArchived,
        });
        setSuccessMessage(`Gallery photo "${formData.title}" added to collection.`);
      }

      setIsModalOpen(false);
      await loadGalleryItems();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save gallery photo');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Toggle Status Handler
  // --------------------------------------------------------------------------
  const handleToggleArchive = async (item: GalleryItem) => {
    const nextArchived = !item.isArchived;
    try {
      await adminRepository.updateGalleryItem(item.id, { isArchived: nextArchived });
      setSuccessMessage(
        nextArchived
          ? `Photo "${item.title}" moved to archives.`
          : `Photo "${item.title}" restored to active gallery.`
      );
      await loadGalleryItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update photo visibility');
    }
  };

  // --------------------------------------------------------------------------
  // Delete Gallery Item Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (item: GalleryItem) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteGalleryItem(itemToDelete.id);
      setSuccessMessage(`Gallery photo "${itemToDelete.title}" deleted.`);
      setItemToDelete(null);
      await loadGalleryItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete gallery item');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<GalleryItem>[] = [
    {
      key: 'title',
      header: 'Media Asset & Title',
      render: (item) => (
        <div className="flex items-center space-x-3 max-w-sm">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-xs">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback on broken image
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200';
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-xs truncate" title={item.title}>
              {item.title}
            </div>
            {item.description ? (
              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={item.description}>
                {item.description}
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 italic">No caption provided</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
            CATEGORY_BADGES[item.category]
          }`}
        >
          {CATEGORY_LABELS[item.category]}
        </span>
      ),
    },
    {
      key: 'eventName',
      header: 'Event Association',
      render: (item) =>
        item.eventName ? (
          <div className="text-xs font-medium text-slate-800 truncate max-w-[160px]" title={item.eventName}>
            {item.eventName}
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">General Media</span>
        ),
    },
    {
      key: 'date',
      header: 'Captured Date',
      render: (item) => (
        <div className="font-mono text-[11px] text-slate-600">
          {item.date}
        </div>
      ),
    },
    {
      key: 'isArchived',
      header: 'Visibility',
      render: (item) => {
        const isActive = !item.isArchived;
        return (
          <button
            type="button"
            onClick={() => handleToggleArchive(item)}
            title="Click to toggle active / archived visibility"
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
            onClick={loadGalleryItems}
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
        searchPlaceholder="Search gallery by photo title, event, category, or caption..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={galleryItems.length}
        filteredCount={filteredItems.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Add Photo"
      >
        {/* Category Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="gal-cat-filter" className="text-xs text-slate-600 font-medium">
            Category:
          </label>
          <select
            id="gal-cat-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="events">Community Events</option>
            <option value="workshops">Workshops</option>
            <option value="team">Team & Leads</option>
            <option value="hackathons">Hackathons</option>
            <option value="community">Builder Community</option>
          </select>
        </div>

        {/* Dynamic Event Filter */}
        {dynamicEvents.length > 0 && (
          <div className="flex items-center space-x-1.5">
            <label htmlFor="gal-event-filter" className="text-xs text-slate-600 font-medium">
              Event:
            </label>
            <select
              id="gal-event-filter"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden max-w-[140px] truncate"
            >
              <option value="all">All Events ({dynamicEvents.length})</option>
              {dynamicEvents.map((evt) => (
                <option key={evt} value={evt}>
                  {evt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Visibility / Status Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="gal-status-filter" className="text-xs text-slate-600 font-medium">
            Status:
          </label>
          <select
            id="gal-status-filter"
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

      {/* Gallery Items Data Table */}
      <CRUDTable
        data={filteredItems}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching photos found' : 'No photos in gallery'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or category/event filters.'
            : 'Get started by publishing workshop, hackathon, and team moments to the community gallery.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Add / Edit Gallery Item) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
        subtitle={
          editingItem
            ? `Editing metadata for "${editingItem.title}"`
            : 'Upload or link high-resolution photos for community event albums'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingItem ? 'Update Photo' : 'Add Photo'}
        maxWidthClass="max-w-2xl"
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <FormField
              label="Photo Title / Headline"
              htmlFor="gal-title"
              required
              error={formErrors.title}
              hint="Minimum 3 characters"
            >
              <TextInput
                id="gal-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Hands-on Serverless Lab Session"
                hasError={Boolean(formErrors.title)}
              />
            </FormField>
          </div>

          {/* Category */}
          <FormField
            label="Category"
            htmlFor="gal-category"
            required
            error={formErrors.category}
          >
            <Select
              id="gal-category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as GalleryFormData['category'],
                })
              }
              hasError={Boolean(formErrors.category)}
            >
              <option value="events">Community Event</option>
              <option value="workshops">Technical Workshop</option>
              <option value="team">Core Team & Leads</option>
              <option value="hackathons">Hackathon & Demo Day</option>
              <option value="community">Builder Community</option>
            </Select>
          </FormField>

          {/* Event Name */}
          <FormField
            label="Associated Event Name (Optional)"
            htmlFor="gal-event"
            hint="e.g. Serverless Workshop 2026"
          >
            <TextInput
              id="gal-event"
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              placeholder="e.g. Autumn Cloud Bootcamp 2026"
            />
          </FormField>

          {/* Date */}
          <FormField
            label="Capture Date"
            htmlFor="gal-date"
            required
            error={formErrors.date}
          >
            <TextInput
              id="gal-date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              hasError={Boolean(formErrors.date)}
            />
          </FormField>

          {/* Visibility Status */}
          <FormField
            label="Display State"
            htmlFor="gal-status"
            required
          >
            <Select
              id="gal-status"
              value={formData.isArchived ? 'true' : 'false'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isArchived: e.target.value === 'true',
                })
              }
            >
              <option value="false">Active (Visible in Public Gallery)</option>
              <option value="true">Archived (Hidden from Public)</option>
            </Select>
          </FormField>

          {/* Media URL Field */}
          <div className="sm:col-span-2">
            <MediaField
              label="Photo Asset URL (Cloudinary / HTTPS)"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              error={formErrors.imageUrl}
              required
              placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
              helperText="Provide a direct CDN image link or select a demo preset fixture below."
              previewHeightClass="h-36"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <FormField
              label="Photo Description / Caption (Optional)"
              htmlFor="gal-desc"
              hint="Context or details about the captured moment"
            >
              <TextArea
                id="gal-desc"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Students collaborating during the cloud architecture challenge..."
              />
            </FormField>
          </div>
        </div>
      </FormModal>

      {/* Destructive Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Gallery Photo"
        itemTitle={itemToDelete?.title}
        message="Are you sure you want to delete this photo from the community gallery? This action cannot be undone."
        confirmLabel="Delete Photo"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
