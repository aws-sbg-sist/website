import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Achievement } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateAchievementForm } from '../../schemas';
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

interface AchievementFormData {
  title: string;
  recipientName: string;
  category: Achievement['category'];
  description: string;
  date: string;
  proofUrl: string;
  academicYear: string;
  isArchived: boolean;
}

const INITIAL_FORM_DATA: AchievementFormData = {
  title: '',
  recipientName: '',
  category: 'certification',
  description: '',
  date: '',
  proofUrl: '',
  academicYear: '2025-2026',
  isArchived: false,
};

const CATEGORY_LABELS: Record<Achievement['category'], string> = {
  certification: 'AWS Certification',
  hackathon: 'Hackathon Award',
  project: 'Project Recognition',
  community: 'Community Leadership',
};

const CATEGORY_BADGES: Record<Achievement['category'], string> = {
  certification: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  hackathon: 'bg-amber-100 text-amber-900 border-amber-200',
  project: 'bg-blue-100 text-blue-900 border-blue-200',
  community: 'bg-purple-100 text-purple-900 border-purple-200',
};

export const AchievementsManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState<AchievementFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Delete Confirmation State
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadAchievements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getAchievements();
      setAchievements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load student achievements');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

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
    const years = Array.from(new Set(achievements.map((a) => a.academicYear))).filter(Boolean);
    return years.sort().reverse();
  }, [achievements]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.academicYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesYear = yearFilter === 'all' || item.academicYear === yearFilter;

      const isArchived = item.isArchived;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !isArchived) ||
        (statusFilter === 'archived' && isArchived);

      return matchesSearch && matchesCategory && matchesYear && matchesStatus;
    });
  }, [achievements, searchQuery, categoryFilter, yearFilter, statusFilter]);

  const isFiltered =
    searchQuery !== '' ||
    categoryFilter !== 'all' ||
    yearFilter !== 'all' ||
    statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setYearFilter('all');
    setStatusFilter('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingAchievement(null);
    setFormData({
      ...INITIAL_FORM_DATA,
      academicYear: yearFilter !== 'all' ? yearFilter : '2025-2026',
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Achievement) => {
    setEditingAchievement(item);
    setFormData({
      title: item.title,
      recipientName: item.recipientName,
      category: item.category,
      description: item.description,
      date: item.date,
      proofUrl: item.proofUrl || '',
      academicYear: item.academicYear,
      isArchived: item.isArchived,
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingAchievement(null);
    setFormErrors({});
    setModalApiError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    // Validate using pure TypeScript schema validator
    const validation = validateAchievementForm({
      title: formData.title,
      recipientName: formData.recipientName,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      proofUrl: formData.proofUrl || undefined,
      academicYear: formData.academicYear,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      if (editingAchievement) {
        // Update existing achievement
        await adminRepository.updateAchievement(editingAchievement.id, {
          title: formData.title.trim(),
          recipientName: formData.recipientName.trim(),
          category: formData.category,
          description: formData.description.trim(),
          date: formData.date,
          proofUrl: formData.proofUrl.trim() || undefined,
          academicYear: formData.academicYear.trim(),
          isArchived: formData.isArchived,
        });
        setSuccessMessage(`Achievement "${formData.title}" updated successfully.`);
      } else {
        // Create new achievement
        await adminRepository.createAchievement({
          title: formData.title.trim(),
          recipientName: formData.recipientName.trim(),
          category: formData.category,
          description: formData.description.trim(),
          date: formData.date,
          proofUrl: formData.proofUrl.trim() || undefined,
          academicYear: formData.academicYear.trim(),
          isArchived: formData.isArchived,
        });
        setSuccessMessage(`Achievement "${formData.title}" recorded.`);
      }

      setIsModalOpen(false);
      await loadAchievements();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save achievement');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Toggle Status Handler
  // --------------------------------------------------------------------------
  const handleToggleArchive = async (item: Achievement) => {
    const nextArchived = !item.isArchived;
    try {
      await adminRepository.updateAchievement(item.id, { isArchived: nextArchived });
      setSuccessMessage(
        nextArchived
          ? `Achievement "${item.title}" moved to archives.`
          : `Achievement "${item.title}" reactivated.`
      );
      await loadAchievements();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update achievement status');
    }
  };

  // --------------------------------------------------------------------------
  // Delete Achievement Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (item: Achievement) => {
    setAchievementToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!achievementToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteAchievement(achievementToDelete.id);
      setSuccessMessage(`Achievement "${achievementToDelete.title}" deleted.`);
      setAchievementToDelete(null);
      await loadAchievements();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete achievement');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<Achievement>[] = [
    {
      key: 'title',
      header: 'Accolade / Achievement',
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
      key: 'recipientName',
      header: 'Honoree / Recipient',
      render: (item) => (
        <div className="text-xs font-semibold text-slate-800">
          {item.recipientName}
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
      key: 'academicYear',
      header: 'Batch Year',
      render: (item) => (
        <div>
          <div className="font-mono text-[11px] font-semibold text-slate-700">
            {item.academicYear}
          </div>
          <div className="text-[10px] text-slate-400">{item.date}</div>
        </div>
      ),
    },
    {
      key: 'proofUrl',
      header: 'Verification Proof',
      render: (item) =>
        item.proofUrl ? (
          <a
            href={item.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] font-medium text-amber-700 hover:text-amber-900 underline"
            title={item.proofUrl}
          >
            <span>Verify Proof</span>
            <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <span className="text-slate-400 text-[11px]">Unlinked</span>
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
            onClick={loadAchievements}
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
        searchPlaceholder="Search achievements by title, recipient, batch, or category..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={achievements.length}
        filteredCount={filteredAchievements.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Add Achievement"
      >
        {/* Category Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="ach-cat-filter" className="text-xs text-slate-600 font-medium">
            Category:
          </label>
          <select
            id="ach-cat-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="certification">AWS Certifications</option>
            <option value="hackathon">Hackathon Awards</option>
            <option value="project">Project Awards</option>
            <option value="community">Community Honors</option>
          </select>
        </div>

        {/* Dynamic Academic Year Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="ach-year-filter" className="text-xs text-slate-600 font-medium">
            Batch:
          </label>
          <select
            id="ach-year-filter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 font-mono focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Batches ({dynamicAcademicYears.length})</option>
            {dynamicAcademicYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="ach-status-filter" className="text-xs text-slate-600 font-medium">
            Status:
          </label>
          <select
            id="ach-status-filter"
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

      {/* Achievements Data Table */}
      <CRUDTable
        data={filteredAchievements}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching achievements found' : 'No achievements recorded'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or category/batch filters.'
            : 'Get started by recording student AWS certifications or hackathon accolades.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Add / Edit Achievement) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAchievement ? 'Edit Achievement Record' : 'Log Student Achievement'}
        subtitle={
          editingAchievement
            ? `Updating "${editingAchievement.title}"`
            : 'Record a certification milestone, hackathon win, or community accolade'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingAchievement ? 'Update Achievement' : 'Log Achievement'}
        maxWidthClass="max-w-2xl"
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <FormField
              label="Accolade / Achievement Title"
              htmlFor="ach-title"
              required
              error={formErrors.title}
              hint="Minimum 3 characters"
            >
              <TextInput
                id="ach-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AWS Certified Solutions Architect — Associate (100% Batch Clearance)"
                hasError={Boolean(formErrors.title)}
              />
            </FormField>
          </div>

          {/* Recipient */}
          <FormField
            label="Honoree / Recipient Name"
            htmlFor="ach-recipient"
            required
            error={formErrors.recipientName}
            hint="Student name or study cohort"
          >
            <TextInput
              id="ach-recipient"
              type="text"
              required
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              placeholder="e.g. Study Cohort Alpha (12 Members)"
              hasError={Boolean(formErrors.recipientName)}
            />
          </FormField>

          {/* Category */}
          <FormField
            label="Achievement Category"
            htmlFor="ach-category"
            required
            error={formErrors.category}
          >
            <Select
              id="ach-category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as AchievementFormData['category'],
                })
              }
              hasError={Boolean(formErrors.category)}
            >
              <option value="certification">AWS Industry Certification</option>
              <option value="hackathon">Hackathon Recognition / Podium</option>
              <option value="project">Project Showcase Award</option>
              <option value="community">Community Service Recognition</option>
            </Select>
          </FormField>

          {/* Academic Year */}
          <FormField
            label="Academic Year"
            htmlFor="ach-year"
            required
            error={formErrors.academicYear}
            hint="Format: YYYY-YYYY"
          >
            <TextInput
              id="ach-year"
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
            label="Achievement Date"
            htmlFor="ach-date"
            required
            error={formErrors.date}
          >
            <TextInput
              id="ach-date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              hasError={Boolean(formErrors.date)}
            />
          </FormField>

          {/* Proof URL */}
          <div className="sm:col-span-2">
            <FormField
              label="Credential Proof / Verification URL"
              htmlFor="ach-proof"
              error={formErrors.proofUrl}
              hint="Credly badge link, hackathon devpost, or official announcement URL"
            >
              <TextInput
                id="ach-proof"
                type="url"
                value={formData.proofUrl}
                onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                placeholder="https://www.credly.com/badges/... or https://hackathon.demo"
                hasError={Boolean(formErrors.proofUrl)}
              />
            </FormField>
          </div>

          {/* Status */}
          <div className="sm:col-span-2">
            <FormField
              label="Display State"
              htmlFor="ach-archive"
              required
            >
              <Select
                id="ach-archive"
                value={formData.isArchived ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isArchived: e.target.value === 'true',
                  })
                }
              >
                <option value="false">Active (Featured on Public Wall)</option>
                <option value="true">Archived (Historical Record)</option>
              </Select>
            </FormField>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <FormField
              label="Accolade Summary & Description"
              htmlFor="ach-desc"
              required
              error={formErrors.description}
              hint="Minimum 10 characters"
            >
              <TextArea
                id="ach-desc"
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details of certification exam passed, hackathon problem solved, or leadership award conferred..."
                hasError={Boolean(formErrors.description)}
              />
            </FormField>
          </div>
        </div>
      </FormModal>

      {/* Destructive Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(achievementToDelete)}
        onClose={() => setAchievementToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Achievement Record"
        itemTitle={`${achievementToDelete?.title} (${achievementToDelete?.recipientName})`}
        message="Are you sure you want to delete this achievement record? This entry will be permanently removed."
        confirmLabel="Delete Achievement"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
