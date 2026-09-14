import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { CoreTeamMember } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateCoreTeamForm } from '../../schemas';
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

interface CoreTeamFormData {
  fullName: string;
  designation: string;
  academicYear: string;
  bio: string;
  avatarUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  order: number;
  status: 'current' | 'alumni';
}

const INITIAL_FORM_DATA: CoreTeamFormData = {
  fullName: '',
  designation: '',
  academicYear: '2025-2026',
  bio: '',
  avatarUrl: '',
  linkedinUrl: '',
  githubUrl: '',
  order: 1,
  status: 'current',
};

export const CoreTeamManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [teamMembers, setTeamMembers] = useState<CoreTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<CoreTeamMember | null>(null);
  const [formData, setFormData] = useState<CoreTeamFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Delete Confirmation State
  const [memberToDelete, setMemberToDelete] = useState<CoreTeamMember | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadCoreTeam = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getCoreTeam();
      setTeamMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load core team members');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoreTeam();
  }, [loadCoreTeam]);

  // Auto-dismiss success message after 4s
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // --------------------------------------------------------------------------
  // Dynamic Academic Years Extraction
  // --------------------------------------------------------------------------
  const dynamicAcademicYears = useMemo(() => {
    const years = Array.from(new Set(teamMembers.map((m) => m.academicYear))).filter(Boolean);
    return years.sort().reverse();
  }, [teamMembers]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      // Search matching name, designation, or bio
      const matchesSearch =
        searchQuery.trim() === '' ||
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.bio.toLowerCase().includes(searchQuery.toLowerCase());

      // Academic year filter
      const matchesYear = selectedYear === 'all' || member.academicYear === selectedYear;

      // Status filter
      const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;

      return matchesSearch && matchesYear && matchesStatus;
    });
  }, [teamMembers, searchQuery, selectedYear, selectedStatus]);

  const isFiltered = searchQuery !== '' || selectedYear !== 'all' || selectedStatus !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedStatus('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingMember(null);
    const nextOrder =
      teamMembers.filter((m) => m.academicYear === (selectedYear !== 'all' ? selectedYear : '2025-2026'))
        .length + 1;

    setFormData({
      ...INITIAL_FORM_DATA,
      academicYear: selectedYear !== 'all' ? selectedYear : '2025-2026',
      order: nextOrder,
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: CoreTeamMember) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName,
      designation: member.designation,
      academicYear: member.academicYear,
      bio: member.bio,
      avatarUrl: member.avatarUrl || '',
      linkedinUrl: member.linkedinUrl || '',
      githubUrl: member.githubUrl || '',
      order: member.order,
      status: member.status,
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingMember(null);
    setFormErrors({});
    setModalApiError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    // Validate using pure TypeScript schema validator
    const validation = validateCoreTeamForm({
      fullName: formData.fullName,
      designation: formData.designation,
      academicYear: formData.academicYear,
      bio: formData.bio,
      avatarUrl: formData.avatarUrl || undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      githubUrl: formData.githubUrl || undefined,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      if (editingMember) {
        // Update core team member
        await adminRepository.updateCoreTeamMember(editingMember.id, {
          fullName: formData.fullName.trim(),
          designation: formData.designation.trim(),
          academicYear: formData.academicYear.trim(),
          bio: formData.bio.trim(),
          avatarUrl: formData.avatarUrl.trim() || undefined,
          linkedinUrl: formData.linkedinUrl.trim() || undefined,
          githubUrl: formData.githubUrl.trim() || undefined,
          order: Number(formData.order) || 1,
          status: formData.status,
        });
        setSuccessMessage(`Core team member "${formData.fullName}" updated successfully.`);
      } else {
        // Create new core team member
        await adminRepository.createCoreTeamMember({
          fullName: formData.fullName.trim(),
          designation: formData.designation.trim(),
          academicYear: formData.academicYear.trim(),
          bio: formData.bio.trim(),
          avatarUrl: formData.avatarUrl.trim() || undefined,
          linkedinUrl: formData.linkedinUrl.trim() || undefined,
          githubUrl: formData.githubUrl.trim() || undefined,
          order: Number(formData.order) || 1,
          status: formData.status,
        });
        setSuccessMessage(`Leadership member "${formData.fullName}" added to batch ${formData.academicYear}.`);
      }

      setIsModalOpen(false);
      await loadCoreTeam();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save core team member');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Order Adjustment (Move Up / Move Down)
  // --------------------------------------------------------------------------
  const handleReorder = async (member: CoreTeamMember, direction: 'up' | 'down') => {
    const currentOrder = member.order;
    const newOrder = direction === 'up' ? Math.max(1, currentOrder - 1) : currentOrder + 1;
    if (newOrder === currentOrder) return;

    try {
      await adminRepository.updateCoreTeamMember(member.id, { order: newOrder });
      setSuccessMessage(`Display order for ${member.fullName} updated to #${newOrder}.`);
      await loadCoreTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member ordering');
    }
  };

  // --------------------------------------------------------------------------
  // Alumni Transition / Status Toggle
  // --------------------------------------------------------------------------
  const handleToggleAlumniStatus = async (member: CoreTeamMember) => {
    const nextStatus = member.status === 'current' ? 'alumni' : 'current';
    try {
      await adminRepository.updateCoreTeamMember(member.id, { status: nextStatus });
      setSuccessMessage(
        nextStatus === 'alumni'
          ? `Transitioned ${member.fullName} to Alumni status.`
          : `Restored ${member.fullName} to Active Core Team.`
      );
      await loadCoreTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update leadership status');
    }
  };

  // --------------------------------------------------------------------------
  // Delete Member Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (member: CoreTeamMember) => {
    setMemberToDelete(member);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteCoreTeamMember(memberToDelete.id);
      setSuccessMessage(`Leadership record for "${memberToDelete.fullName}" removed.`);
      setMemberToDelete(null);
      await loadCoreTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete core team record');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<CoreTeamMember>[] = [
    {
      key: 'order',
      header: 'Order',
      headerClassName: 'w-16 text-center',
      className: 'text-center',
      render: (member) => (
        <div className="inline-flex items-center space-x-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-amber-400">
            #{member.order}
          </span>
          <div className="flex flex-col space-y-0.5">
            <button
              type="button"
              onClick={() => handleReorder(member, 'up')}
              disabled={member.order <= 1}
              className="text-[9px] text-slate-400 hover:text-slate-900 disabled:opacity-30 leading-none"
              title="Move Up in Rank"
              aria-label={`Move ${member.fullName} up`}
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => handleReorder(member, 'down')}
              className="text-[9px] text-slate-400 hover:text-slate-900 leading-none"
              title="Move Down in Rank"
              aria-label={`Move ${member.fullName} down`}
            >
              ▼
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'fullName',
      header: 'Leader',
      render: (member) => (
        <div className="flex items-center space-x-3">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="h-9 w-9 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
              {member.fullName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-slate-900 truncate">{member.fullName}</div>
            <div className="text-[11px] text-amber-700 font-medium truncate">
              {member.designation}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'academicYear',
      header: 'Batch Year',
      render: (member) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-800 border border-slate-200 font-mono">
          {member.academicYear}
        </span>
      ),
    },
    {
      key: 'bio',
      header: 'Bio & Focus',
      render: (member) => (
        <div className="text-slate-600 text-[11px] line-clamp-2 max-w-[280px]">
          {member.bio}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status / Cohort',
      render: (member) => {
        const isCurrent = member.status === 'current';
        return (
          <button
            type="button"
            onClick={() => handleToggleAlumniStatus(member)}
            title="Click to transition between Current Core Team and Alumni"
            className={`inline-flex items-center space-x-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              isCurrent
                ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCurrent ? 'bg-amber-500' : 'bg-purple-500'
              }`}
            />
            <span>{member.status}</span>
          </button>
        );
      },
    },
    {
      key: 'social',
      header: 'Profiles',
      render: (member) => (
        <div className="flex items-center space-x-2">
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-[11px] font-medium underline"
              title="LinkedIn Profile"
            >
              LinkedIn
            </a>
          )}
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 text-[11px] font-medium underline"
              title="GitHub Profile"
            >
              GitHub
            </a>
          )}
          {!member.linkedinUrl && !member.githubUrl && (
            <span className="text-slate-400 text-[11px]">—</span>
          )}
        </div>
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
            onClick={loadCoreTeam}
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

      {/* Search & Dynamic Filter Toolbar */}
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search leaders by name, designation, or bio..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={teamMembers.length}
        filteredCount={filteredMembers.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Add Core Team Member"
      >
        {/* Dynamic Academic Year Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="year-filter" className="text-xs text-slate-600 font-medium">
            Batch Year:
          </label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 font-mono focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Batches ({dynamicAcademicYears.length})</option>
            {dynamicAcademicYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr} Batch
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="status-filter" className="text-xs text-slate-600 font-medium">
            Cohort Status:
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="current">Current Leadership</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>
      </SearchFilterToolbar>

      {/* Core Team Table */}
      <CRUDTable
        data={filteredMembers}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching leadership members' : 'No core team recorded'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or batch year filter.'
            : 'Get started by adding elected leads for this academic year.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Create / Edit Core Team Member) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMember ? 'Edit Leadership Profile' : 'Add Core Team Member'}
        subtitle={
          editingMember
            ? `Updating designation and profile for ${editingMember.fullName}`
            : 'Assign a student lead to the elected core team'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingMember ? 'Update Leader' : 'Save Leader'}
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <FormField
            label="Full Name"
            htmlFor="leader-name"
            required
            error={formErrors.fullName}
          >
            <TextInput
              id="leader-name"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Aarav Patel"
              hasError={Boolean(formErrors.fullName)}
            />
          </FormField>

          {/* Designation */}
          <FormField
            label="Designation / Role Title"
            htmlFor="leader-designation"
            required
            error={formErrors.designation}
            hint="e.g. Community Lead & Cloud Architect"
          >
            <TextInput
              id="leader-designation"
              type="text"
              required
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Cloud Architecture Lead"
              hasError={Boolean(formErrors.designation)}
            />
          </FormField>

          {/* Academic Year */}
          <FormField
            label="Academic Year Batch"
            htmlFor="leader-year"
            required
            error={formErrors.academicYear}
            hint="Format: YYYY-YYYY"
          >
            <TextInput
              id="leader-year"
              type="text"
              required
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="e.g. 2025-2026"
              hasError={Boolean(formErrors.academicYear)}
            />
          </FormField>

          {/* Display Order */}
          <FormField
            label="Display Rank / Order"
            htmlFor="leader-order"
            required
            hint="Priority order within batch"
          >
            <TextInput
              id="leader-order"
              type="number"
              min="1"
              required
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
            />
          </FormField>

          {/* Status */}
          <div className="sm:col-span-2">
            <FormField
              label="Cohort Assignment"
              htmlFor="leader-status"
              required
            >
              <Select
                id="leader-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as CoreTeamFormData['status'],
                  })
                }
              >
                <option value="current">Current Leadership (Active Batch)</option>
                <option value="alumni">Alumni Lead (Graduated / Past Batch)</option>
              </Select>
            </FormField>
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <FormField
              label="Biography & Focus Area"
              htmlFor="leader-bio"
              required
              error={formErrors.bio}
              hint="Minimum 10 characters"
            >
              <TextArea
                id="leader-bio"
                rows={3}
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="AWS Certified Solutions Architect Associate. Passionate about serverless computing and mentoring junior students."
                hasError={Boolean(formErrors.bio)}
              />
            </FormField>
          </div>

          {/* Social Profiles */}
          <FormField
            label="LinkedIn Profile URL"
            htmlFor="leader-linkedin"
            error={formErrors.linkedinUrl}
          >
            <TextInput
              id="leader-linkedin"
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              hasError={Boolean(formErrors.linkedinUrl)}
            />
          </FormField>

          <FormField
            label="GitHub Profile URL"
            htmlFor="leader-github"
            error={formErrors.githubUrl}
          >
            <TextInput
              id="leader-github"
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              hasError={Boolean(formErrors.githubUrl)}
            />
          </FormField>

          {/* Avatar Media Field */}
          <div className="sm:col-span-2">
            <MediaField
              label="Profile Photo / Avatar URL"
              value={formData.avatarUrl}
              onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
              error={formErrors.avatarUrl}
              placeholder="https://images.unsplash.com/... or CDN link"
              helperText="High-resolution headshot URL or Cloudinary CDN asset link."
              previewHeightClass="h-28"
            />
          </div>
        </div>
      </FormModal>

      {/* Destructive Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Leadership Record"
        itemTitle={`${memberToDelete?.fullName} (${memberToDelete?.designation})`}
        message="Are you sure you want to remove this leadership profile? This will delete their entry from the core team roster."
        confirmLabel="Delete Leader"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
