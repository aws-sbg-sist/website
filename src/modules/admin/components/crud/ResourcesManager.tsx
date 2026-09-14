import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Resource } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateResourceForm } from '../../schemas';
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

interface ResourceFormData {
  title: string;
  description: string;
  category: Resource['category'];
  resourceType: Resource['resourceType'];
  url: string;
  addedBy: string;
  isArchived: boolean;
}

const INITIAL_FORM_DATA: ResourceFormData = {
  title: '',
  description: '',
  category: 'cloud_architecture',
  resourceType: 'link',
  url: '',
  addedBy: 'Aarav Patel',
  isArchived: false,
};

const CATEGORY_LABELS: Record<Resource['category'], string> = {
  cloud_architecture: 'Cloud Architecture',
  certification: 'Certification Guide',
  devops: 'DevOps & CI/CD',
  ai_ml: 'AI & Machine Learning',
  serverless: 'Serverless Computing',
  security: 'Cloud Security & IAM',
};

const CATEGORY_BADGES: Record<Resource['category'], string> = {
  cloud_architecture: 'bg-amber-100 text-amber-900 border-amber-200',
  certification: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  devops: 'bg-blue-100 text-blue-900 border-blue-200',
  ai_ml: 'bg-purple-100 text-purple-900 border-purple-200',
  serverless: 'bg-cyan-100 text-cyan-900 border-cyan-200',
  security: 'bg-rose-100 text-rose-900 border-rose-200',
};

const TYPE_ICONS: Record<Resource['resourceType'], { label: string; badge: string }> = {
  repo: { label: 'GitHub Repo', badge: 'bg-slate-900 text-white border-slate-800' },
  pdf: { label: 'PDF Guide', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  video: { label: 'Video Lab', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  link: { label: 'Documentation', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
};

export const ResourcesManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Delete Confirmation State
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getResources();
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load learning resources');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  // Auto-dismiss success notification
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.addedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesType = typeFilter === 'all' || item.resourceType === typeFilter;

      const isArchived = item.isArchived;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !isArchived) ||
        (statusFilter === 'archived' && isArchived);

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [resources, searchQuery, categoryFilter, typeFilter, statusFilter]);

  const isFiltered =
    searchQuery !== '' ||
    categoryFilter !== 'all' ||
    typeFilter !== 'all' ||
    statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingResource(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Resource) => {
    setEditingResource(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      resourceType: item.resourceType,
      url: item.url,
      addedBy: item.addedBy,
      isArchived: item.isArchived,
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingResource(null);
    setFormErrors({});
    setModalApiError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    // Validate using pure TypeScript schema validator
    const validation = validateResourceForm({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      resourceType: formData.resourceType,
      url: formData.url,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      if (editingResource) {
        // Update existing resource
        await adminRepository.updateResource(editingResource.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          resourceType: formData.resourceType,
          url: formData.url.trim(),
          addedBy: formData.addedBy.trim() || 'Admin Lead',
          isArchived: formData.isArchived,
        });
        setSuccessMessage(`Resource "${formData.title}" updated successfully.`);
      } else {
        // Create new resource
        await adminRepository.createResource({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          resourceType: formData.resourceType,
          url: formData.url.trim(),
          addedBy: formData.addedBy.trim() || 'Admin Lead',
          isArchived: formData.isArchived,
        });
        setSuccessMessage(`Resource "${formData.title}" added to library.`);
      }

      setIsModalOpen(false);
      await loadResources();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save resource');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Toggle Status Handler
  // --------------------------------------------------------------------------
  const handleToggleArchive = async (item: Resource) => {
    const nextArchived = !item.isArchived;
    try {
      await adminRepository.updateResource(item.id, { isArchived: nextArchived });
      setSuccessMessage(
        nextArchived
          ? `Resource "${item.title}" moved to archive.`
          : `Resource "${item.title}" reactivated.`
      );
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource status');
    }
  };

  // --------------------------------------------------------------------------
  // Delete Resource Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (item: Resource) => {
    setResourceToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteResource(resourceToDelete.id);
      setSuccessMessage(`Resource "${resourceToDelete.title}" deleted.`);
      setResourceToDelete(null);
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<Resource>[] = [
    {
      key: 'title',
      header: 'Resource Title & Description',
      render: (item) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 truncate" title={item.title}>
            {item.title}
          </div>
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {item.description}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Domain Category',
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
      key: 'resourceType',
      header: 'Type',
      render: (item) => {
        const meta = TYPE_ICONS[item.resourceType];
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${meta.badge}`}
          >
            {meta.label}
          </span>
        );
      },
    },
    {
      key: 'url',
      header: 'External Link',
      render: (item) => (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 font-mono text-[11px] text-amber-700 hover:text-amber-900 hover:underline max-w-[180px] truncate"
          title={item.url}
        >
          <span className="truncate">{item.url.replace(/^https?:\/\//, '')}</span>
          <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ),
    },
    {
      key: 'addedBy',
      header: 'Curator',
      render: (item) => (
        <div className="text-[11px]">
          <div className="font-semibold text-slate-800">{item.addedBy}</div>
          <div className="text-slate-400 text-[10px]">
            {new Date(item.createdAt).toLocaleDateString()}
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
            onClick={loadResources}
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
        searchPlaceholder="Search resources by title, description, category, or URL..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={resources.length}
        filteredCount={filteredResources.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Add Resource"
      >
        {/* Category Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="res-cat-filter" className="text-xs text-slate-600 font-medium">
            Category:
          </label>
          <select
            id="res-cat-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="cloud_architecture">Cloud Architecture</option>
            <option value="certification">Certification</option>
            <option value="devops">DevOps</option>
            <option value="ai_ml">AI & ML</option>
            <option value="serverless">Serverless</option>
            <option value="security">Security</option>
          </select>
        </div>

        {/* Resource Type Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="res-type-filter" className="text-xs text-slate-600 font-medium">
            Type:
          </label>
          <select
            id="res-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Types</option>
            <option value="link">Documentation</option>
            <option value="repo">GitHub Repositories</option>
            <option value="pdf">PDF Guides</option>
            <option value="video">Video Labs</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="res-status-filter" className="text-xs text-slate-600 font-medium">
            Status:
          </label>
          <select
            id="res-status-filter"
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

      {/* Resources Data Table */}
      <CRUDTable
        data={filteredResources}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching resources found' : 'No resources in library'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or category/type filters.'
            : 'Get started by adding curated AWS architecture guides, repositories, or cheat sheets.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Add / Edit Resource) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingResource ? 'Edit Learning Resource' : 'Add Learning Resource'}
        subtitle={
          editingResource
            ? `Updating details for "${editingResource.title}"`
            : 'Add a curated AWS study guide, architecture repository, or lab link'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingResource ? 'Update Resource' : 'Save Resource'}
        maxWidthClass="max-w-2xl"
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <FormField
              label="Resource Title"
              htmlFor="res-title"
              required
              error={formErrors.title}
              hint="Minimum 3 characters"
            >
              <TextInput
                id="res-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AWS Well-Architected Framework: Sustainability Pillar"
                hasError={Boolean(formErrors.title)}
              />
            </FormField>
          </div>

          {/* Category */}
          <FormField
            label="Domain Category"
            htmlFor="res-category"
            required
            error={formErrors.category}
          >
            <Select
              id="res-category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ResourceFormData['category'],
                })
              }
              hasError={Boolean(formErrors.category)}
            >
              <option value="cloud_architecture">Cloud Architecture</option>
              <option value="certification">Certification Guide</option>
              <option value="devops">DevOps & CI/CD</option>
              <option value="ai_ml">AI & Machine Learning</option>
              <option value="serverless">Serverless Computing</option>
              <option value="security">Cloud Security & IAM</option>
            </Select>
          </FormField>

          {/* Resource Type */}
          <FormField
            label="Resource Format / Type"
            htmlFor="res-type"
            required
            error={formErrors.resourceType}
          >
            <Select
              id="res-type"
              value={formData.resourceType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  resourceType: e.target.value as ResourceFormData['resourceType'],
                })
              }
              hasError={Boolean(formErrors.resourceType)}
            >
              <option value="link">Official Documentation / Website</option>
              <option value="repo">GitHub / GitLab Repository</option>
              <option value="pdf">PDF Cheatsheet / Manual</option>
              <option value="video">Video Lecture / Workshop Lab</option>
            </Select>
          </FormField>

          {/* Resource URL */}
          <div className="sm:col-span-2">
            <FormField
              label="Resource Web Link / URL"
              htmlFor="res-url"
              required
              error={formErrors.url}
              hint="Must be a valid HTTP/HTTPS link"
            >
              <TextInput
                id="res-url"
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://docs.aws.amazon.com/... or https://github.com/..."
                hasError={Boolean(formErrors.url)}
              />
            </FormField>
          </div>

          {/* Curator / Added By */}
          <FormField
            label="Curated By"
            htmlFor="res-addedby"
          >
            <TextInput
              id="res-addedby"
              type="text"
              value={formData.addedBy}
              onChange={(e) => setFormData({ ...formData, addedBy: e.target.value })}
              placeholder="e.g. Aarav Patel (Lead)"
            />
          </FormField>

          {/* Status */}
          <FormField
            label="Lifecycle State"
            htmlFor="res-archive"
            required
          >
            <Select
              id="res-archive"
              value={formData.isArchived ? 'true' : 'false'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isArchived: e.target.value === 'true',
                })
              }
            >
              <option value="false">Active (Visible in Library)</option>
              <option value="true">Archived (Historical Reference)</option>
            </Select>
          </FormField>

          {/* Description */}
          <div className="sm:col-span-2">
            <FormField
              label="Resource Description"
              htmlFor="res-desc"
              required
              error={formErrors.description}
              hint="Minimum 10 characters"
            >
              <TextArea
                id="res-desc"
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summary of architectural best practices, tutorial steps, or exam syllabus covered..."
                hasError={Boolean(formErrors.description)}
              />
            </FormField>
          </div>
        </div>
      </FormModal>

      {/* Destructive Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(resourceToDelete)}
        onClose={() => setResourceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Learning Resource"
        itemTitle={resourceToDelete?.title}
        message="Are you sure you want to delete this resource from the library? This link will no longer be available to students."
        confirmLabel="Delete Resource"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
