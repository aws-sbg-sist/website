import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Member } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateMemberForm } from '../../schemas';
import {
  CRUDTable,
  Column,
  FormModal,
  ConfirmDialog,
  SearchFilterToolbar,
  FormField,
  TextInput,
  Select,
  MediaField,
} from './index';

interface MemberFormData {
  fullName: string;
  email: string;
  role: 'member' | 'lead' | 'co-lead' | 'mentor';
  department: string;
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate';
  avatarUrl: string;
  status: 'active' | 'inactive';
}

const INITIAL_FORM_DATA: MemberFormData = {
  fullName: '',
  email: '',
  role: 'member',
  department: '',
  yearOfStudy: '1st Year',
  avatarUrl: '',
  status: 'active',
};

const ROLE_BADGE_STYLES: Record<Member['role'], string> = {
  lead: 'bg-amber-100 text-amber-900 border-amber-200',
  'co-lead': 'bg-blue-100 text-blue-900 border-blue-200',
  mentor: 'bg-purple-100 text-purple-900 border-purple-200',
  member: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const MembersManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<MemberFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Delete Confirmation State
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getMembers();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members roster');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Dismiss success message after 4 seconds
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search matching name, email, or department
      const matchesSearch =
        searchQuery.trim() === '' ||
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, statusFilter]);

  const isFiltered = searchQuery !== '' || roleFilter !== 'all' || statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingMember(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      role: member.role,
      department: member.department,
      yearOfStudy: member.yearOfStudy,
      avatarUrl: member.avatarUrl || '',
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
    const validation = validateMemberForm({
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      yearOfStudy: formData.yearOfStudy,
      avatarUrl: formData.avatarUrl || undefined,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      if (editingMember) {
        // Update existing member
        await adminRepository.updateMember(editingMember.id, {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          role: formData.role,
          department: formData.department.trim(),
          yearOfStudy: formData.yearOfStudy,
          avatarUrl: formData.avatarUrl.trim() || undefined,
          status: formData.status,
        });
        setSuccessMessage(`Member "${formData.fullName}" updated successfully.`);
      } else {
        // Create new member
        await adminRepository.createMember({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          role: formData.role,
          department: formData.department.trim(),
          yearOfStudy: formData.yearOfStudy,
          avatarUrl: formData.avatarUrl.trim() || undefined,
          status: formData.status,
        });
        setSuccessMessage(`New member "${formData.fullName}" registered successfully.`);
      }

      setIsModalOpen(false);
      await loadMembers();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Delete Member Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (member: Member) => {
    setMemberToDelete(member);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteMember(memberToDelete.id);
      setSuccessMessage(`Member "${memberToDelete.fullName}" removed from roster.`);
      setMemberToDelete(null);
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete member');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Toggle Status Handler
  // --------------------------------------------------------------------------
  const handleToggleStatus = async (member: Member) => {
    const nextStatus = member.status === 'active' ? 'inactive' : 'active';
    try {
      await adminRepository.updateMember(member.id, { status: nextStatus });
      setSuccessMessage(`Member "${member.fullName}" status set to ${nextStatus}.`);
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member status');
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<Member>[] = [
    {
      key: 'fullName',
      header: 'Member',
      render: (member) => (
        <div className="flex items-center space-x-3">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-amber-400 border border-slate-700">
              {member.fullName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate">{member.fullName}</div>
            <div className="text-[11px] text-slate-500 truncate">{member.department}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email Address',
      render: (member) => (
        <div className="text-slate-600 font-mono text-[11px] truncate max-w-[200px]">
          {member.email}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (member) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
            ROLE_BADGE_STYLES[member.role]
          }`}
        >
          {member.role}
        </span>
      ),
    },
    {
      key: 'yearOfStudy',
      header: 'Year',
      render: (member) => (
        <span className="text-slate-600 font-medium">{member.yearOfStudy}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (member) => {
        const isActive = member.status === 'active';
        return (
          <button
            type="button"
            onClick={() => handleToggleStatus(member)}
            title="Click to toggle active/inactive status"
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
            <span>{member.status}</span>
          </button>
        );
      },
    },
    {
      key: 'joinedDate',
      header: 'Joined',
      render: (member) => (
        <span className="text-slate-500 text-[11px]">
          {new Date(member.joinedDate).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // --------------------------------------------------------------------------
  // Render View
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-4">
      {/* Inline Global Error Notification */}
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
            onClick={loadMembers}
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
        searchPlaceholder="Search by name, email, or department..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={members.length}
        filteredCount={filteredMembers.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Add Member"
      >
        {/* Role Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="role-filter" className="text-xs text-slate-600 font-medium">
            Role:
          </label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Roles</option>
            <option value="lead">Lead</option>
            <option value="co-lead">Co-Lead</option>
            <option value="mentor">Mentor</option>
            <option value="member">Member</option>
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </SearchFilterToolbar>

      {/* Members Data Table */}
      <CRUDTable
        data={filteredMembers}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching members' : 'No members registered'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or role/status filters.'
            : 'Get started by adding your first student builder to the roster.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Create / Edit Member) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMember ? 'Edit Member Profile' : 'Register New Member'}
        subtitle={
          editingMember
            ? `Updating profile for ${editingMember.fullName}`
            : 'Add a new student builder to the community roster'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingMember ? 'Update Member' : 'Register Member'}
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <FormField
            label="Full Name"
            htmlFor="member-fullname"
            required
            error={formErrors.fullName}
          >
            <TextInput
              id="member-fullname"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Aarav Patel"
              hasError={Boolean(formErrors.fullName)}
            />
          </FormField>

          {/* Email */}
          <FormField
            label="University Email"
            htmlFor="member-email"
            required
            error={formErrors.email}
          >
            <TextInput
              id="member-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. aarav.patel@university.edu"
              hasError={Boolean(formErrors.email)}
            />
          </FormField>

          {/* Role */}
          <FormField
            label="Member Role"
            htmlFor="member-role"
            required
            error={formErrors.role}
          >
            <Select
              id="member-role"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as MemberFormData['role'],
                })
              }
              hasError={Boolean(formErrors.role)}
            >
              <option value="member">Member</option>
              <option value="lead">Lead</option>
              <option value="co-lead">Co-Lead</option>
              <option value="mentor">Mentor</option>
            </Select>
          </FormField>

          {/* Year of Study */}
          <FormField
            label="Year of Study"
            htmlFor="member-year"
            required
            error={formErrors.yearOfStudy}
          >
            <Select
              id="member-year"
              value={formData.yearOfStudy}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yearOfStudy: e.target.value as MemberFormData['yearOfStudy'],
                })
              }
              hasError={Boolean(formErrors.yearOfStudy)}
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Postgraduate">Postgraduate</option>
            </Select>
          </FormField>

          {/* Department */}
          <div className="sm:col-span-2">
            <FormField
              label="Academic Department"
              htmlFor="member-department"
              required
              error={formErrors.department}
            >
              <TextInput
                id="member-department"
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
                hasError={Boolean(formErrors.department)}
              />
            </FormField>
          </div>

          {/* Status */}
          <FormField
            label="Membership Status"
            htmlFor="member-status"
            required
          >
            <Select
              id="member-status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as MemberFormData['status'],
                })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FormField>

          {/* Avatar Media Field */}
          <div className="sm:col-span-2">
            <MediaField
              label="Avatar Profile Image URL"
              value={formData.avatarUrl}
              onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
              error={formErrors.avatarUrl}
              placeholder="https://images.unsplash.com/... or CDN link"
              helperText="Optional profile avatar URL or Cloudinary CDN asset link."
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
        title="Delete Member from Roster"
        itemTitle={memberToDelete?.fullName}
        message="Are you sure you want to delete this member from the community directory? This will permanently remove their records."
        confirmLabel="Delete Member"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
