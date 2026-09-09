import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AlumniTeam, AlumniTeamMember } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateAlumniTeamForm } from '../../schemas';
import {
  CRUDTable,
  Column,
  FormModal,
  ConfirmDialog,
  SearchFilterToolbar,
  FormField,
  TextInput,
  TextArea,
} from './index';

interface AlumniTeamFormData {
  academicYear: string;
  teamLead: string;
  membersCount: string;
  summary: string;
  highlightsInput: string;
  membersInput: string;
}

const INITIAL_FORM_DATA: AlumniTeamFormData = {
  academicYear: '2024-2025',
  teamLead: 'Karan Mehra',
  membersCount: '8',
  summary: 'The inaugural core team that chartered the AWS Student Builder Group chapter and conducted 12 community workshops.',
  highlightsInput: 'Inaugural chapter launch with 150+ members\nHosted 12 hands-on workshops on AWS Cloud Foundations\nOrganized the 2025 Spring Cloud Hackathon',
  membersInput: 'Karan Mehra - Community Lead - Cloud Associate at DemoTech\nDivya Nair - Technical Lead - DevOps Intern at DemoCorp\nTarun Saxena - Events Coordinator',
};

// Helper to parse line-based member inputs
const parseMembersInput = (text: string): AlumniTeamMember[] => {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('-').map((p) => p.trim());
      return {
        name: parts[0] || 'Alumni Member',
        role: parts[1] || 'Core Team',
        currentCompany: parts[2] || undefined,
      };
    });
};

// Helper to format members back to editable text
const formatMembersText = (members: AlumniTeamMember[]): string => {
  return members
    .map((m) => `${m.name} - ${m.role}${m.currentCompany ? ` - ${m.currentCompany}` : ''}`)
    .join('\n');
};

export const AlumniTeamsManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [alumniTeams, setAlumniTeams] = useState<AlumniTeam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<AlumniTeam | null>(null);
  const [formData, setFormData] = useState<AlumniTeamFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Delete Confirmation State
  const [teamToDelete, setTeamToDelete] = useState<AlumniTeam | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadAlumniTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getAlumniTeams();
      setAlumniTeams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alumni teams archive');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlumniTeams();
  }, [loadAlumniTeams]);

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
    const years = Array.from(new Set(alumniTeams.map((t) => t.academicYear))).filter(Boolean);
    return years.sort().reverse();
  }, [alumniTeams]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredTeams = useMemo(() => {
    return alumniTeams.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.academicYear.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teamLead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.members.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesYear = yearFilter === 'all' || item.academicYear === yearFilter;

      return matchesSearch && matchesYear;
    });
  }, [alumniTeams, searchQuery, yearFilter]);

  const isFiltered = searchQuery !== '' || yearFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setYearFilter('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingTeam(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (team: AlumniTeam) => {
    setEditingTeam(team);
    setFormData({
      academicYear: team.academicYear,
      teamLead: team.teamLead,
      membersCount: String(team.membersCount),
      summary: team.summary,
      highlightsInput: team.highlights.join('\n'),
      membersInput: formatMembersText(team.members),
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingTeam(null);
    setFormErrors({});
    setModalApiError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    const parsedCount = parseInt(formData.membersCount, 10) || 1;

    // Validate using pure TypeScript schema validator
    const validation = validateAlumniTeamForm({
      academicYear: formData.academicYear,
      teamLead: formData.teamLead,
      summary: formData.summary,
      membersCount: parsedCount,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const parsedHighlights = formData.highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const parsedMembers = parseMembersInput(formData.membersInput);

    try {
      if (editingTeam) {
        // Update existing alumni team
        await adminRepository.updateAlumniTeam(editingTeam.id, {
          academicYear: formData.academicYear.trim(),
          teamLead: formData.teamLead.trim(),
          membersCount: parsedCount,
          summary: formData.summary.trim(),
          highlights: parsedHighlights.length > 0 ? parsedHighlights : ['Led community chapter'],
          members: parsedMembers.length > 0 ? parsedMembers : [{ name: formData.teamLead, role: 'Lead' }],
        });
        setSuccessMessage(`Alumni team for Batch ${formData.academicYear} updated.`);
      } else {
        // Create new alumni team
        await adminRepository.createAlumniTeam({
          academicYear: formData.academicYear.trim(),
          teamLead: formData.teamLead.trim(),
          membersCount: parsedCount,
          summary: formData.summary.trim(),
          highlights: parsedHighlights.length > 0 ? parsedHighlights : ['Inaugurated chapter events'],
          members: parsedMembers.length > 0 ? parsedMembers : [{ name: formData.teamLead, role: 'Lead' }],
        });
        setSuccessMessage(`Alumni batch ${formData.academicYear} record created successfully.`);
      }

      setIsModalOpen(false);
      await loadAlumniTeams();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save alumni team');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Delete Alumni Team Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (team: AlumniTeam) => {
    setTeamToDelete(team);
  };

  const handleConfirmDelete = async () => {
    if (!teamToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteAlumniTeam(teamToDelete.id);
      setSuccessMessage(`Alumni team record for Batch ${teamToDelete.academicYear} deleted.`);
      setTeamToDelete(null);
      await loadAlumniTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete alumni team');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<AlumniTeam>[] = [
    {
      key: 'academicYear',
      header: 'Batch Year',
      render: (item) => (
        <div>
          <span className="inline-flex items-center rounded-md bg-purple-100 px-2.5 py-1 font-mono text-xs font-bold text-purple-900 border border-purple-200">
            {item.academicYear} Batch
          </span>
        </div>
      ),
    },
    {
      key: 'teamLead',
      header: 'Leadership & Cohort Size',
      render: (item) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">{item.teamLead}</div>
          <div className="text-[11px] text-slate-500">
            {item.membersCount} Core Team Members
          </div>
        </div>
      ),
    },
    {
      key: 'summary',
      header: 'Retrospective Summary',
      render: (item) => (
        <div className="text-[11px] text-slate-600 line-clamp-2 max-w-[280px]">
          {item.summary}
        </div>
      ),
    },
    {
      key: 'highlights',
      header: 'Key Milestone Highlights',
      render: (item) => (
        <ul className="space-y-0.5 text-[10px] text-slate-700 max-w-[220px]">
          {item.highlights.slice(0, 2).map((h, i) => (
            <li key={i} className="truncate list-disc list-inside">
              {h}
            </li>
          ))}
          {item.highlights.length > 2 && (
            <li className="text-slate-400 font-medium">
              +{item.highlights.length - 2} more milestones
            </li>
          )}
        </ul>
      ),
    },
    {
      key: 'members',
      header: 'Alumni Directory Roster',
      render: (item) => (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {item.members.slice(0, 2).map((m) => (
            <span
              key={m.name}
              className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-700 border border-slate-200 truncate"
              title={`${m.name} (${m.role})${m.currentCompany ? ` @ ${m.currentCompany}` : ''}`}
            >
              {m.name} ({m.role})
            </span>
          ))}
          {item.members.length > 2 && (
            <span className="text-[9px] text-slate-400 font-medium">
              +{item.members.length - 2} members
            </span>
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
            onClick={loadAlumniTeams}
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

      {/* Search & Dynamic Batch Filter Toolbar */}
      <SearchFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search past teams by academic year, lead, member, or summary..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={alumniTeams.length}
        filteredCount={filteredTeams.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Add Previous Team"
      >
        {/* Dynamic Batch Year Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="alumni-year-filter" className="text-xs text-slate-600 font-medium">
            Batch Year:
          </label>
          <select
            id="alumni-year-filter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
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
      </SearchFilterToolbar>

      {/* Alumni Teams Data Table */}
      <CRUDTable
        data={filteredTeams}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching alumni batches' : 'No previous teams recorded'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or batch year filter.'
            : 'Get started by documenting historical core team compositions and milestones.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Add / Edit Alumni Team) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTeam ? 'Edit Alumni Team Record' : 'Record Previous Core Team'}
        subtitle={
          editingTeam
            ? `Editing Batch ${editingTeam.academicYear} historical retrospective`
            : 'Archive leadership composition and achievements for a graduated batch'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingTeam ? 'Update Record' : 'Save Record'}
        maxWidthClass="max-w-3xl"
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Academic Year */}
          <FormField
            label="Academic Year Batch"
            htmlFor="alumni-year"
            required
            error={formErrors.academicYear}
            hint="Format: YYYY-YYYY (e.g. 2024-2025)"
          >
            <TextInput
              id="alumni-year"
              type="text"
              required
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="e.g. 2024-2025"
              hasError={Boolean(formErrors.academicYear)}
            />
          </FormField>

          {/* Team Lead */}
          <FormField
            label="Community Team Lead"
            htmlFor="alumni-lead"
            required
            error={formErrors.teamLead}
          >
            <TextInput
              id="alumni-lead"
              type="text"
              required
              value={formData.teamLead}
              onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
              placeholder="e.g. Karan Mehra"
              hasError={Boolean(formErrors.teamLead)}
            />
          </FormField>

          {/* Members Count */}
          <div className="sm:col-span-2">
            <FormField
              label="Total Core Team Size / Count"
              htmlFor="alumni-count"
              required
              error={formErrors.membersCount}
              hint="Number of elected leadership members in this batch"
            >
              <TextInput
                id="alumni-count"
                type="number"
                min="1"
                required
                value={formData.membersCount}
                onChange={(e) => setFormData({ ...formData, membersCount: e.target.value })}
                placeholder="e.g. 8"
                hasError={Boolean(formErrors.membersCount)}
              />
            </FormField>
          </div>

          {/* Summary */}
          <div className="sm:col-span-2">
            <FormField
              label="Batch Summary & Historical Impact"
              htmlFor="alumni-summary"
              required
              error={formErrors.summary}
              hint="Minimum 15 characters"
            >
              <TextArea
                id="alumni-summary"
                rows={3}
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Overview of chapter growth, key technical initiatives, and community impact during this term..."
                hasError={Boolean(formErrors.summary)}
              />
            </FormField>
          </div>

          {/* Highlights */}
          <div className="sm:col-span-2">
            <FormField
              label="Milestone Highlights (One per line)"
              htmlFor="alumni-highlights"
              hint="Key awards, flagship workshops, and hackathons chartered"
            >
              <TextArea
                id="alumni-highlights"
                rows={3}
                value={formData.highlightsInput}
                onChange={(e) => setFormData({ ...formData, highlightsInput: e.target.value })}
                placeholder="Inaugural chapter launch with 150+ members&#10;Hosted 12 hands-on workshops on AWS Foundations&#10;Organized Spring Cloud Hackathon"
              />
            </FormField>
          </div>

          {/* Members List */}
          <div className="sm:col-span-2">
            <FormField
              label="Key Alumni Roster (Format: Name - Role - Current Company)"
              htmlFor="alumni-roster"
              hint="One member per line (e.g. Karan Mehra - Community Lead - Cloud Associate at DemoCorp)"
            >
              <TextArea
                id="alumni-roster"
                rows={4}
                value={formData.membersInput}
                onChange={(e) => setFormData({ ...formData, membersInput: e.target.value })}
                placeholder="Karan Mehra - Community Lead - Cloud Associate at DemoCorp&#10;Divya Nair - Technical Lead - DevOps Intern at DemoCorp&#10;Tarun Saxena - Events Coordinator"
                className="font-mono text-xs"
              />
            </FormField>
          </div>
        </div>
      </FormModal>

      {/* Destructive Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(teamToDelete)}
        onClose={() => setTeamToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Historical Team Archive"
        itemTitle={`Batch ${teamToDelete?.academicYear} (${teamToDelete?.teamLead})`}
        message="Are you sure you want to delete this historical core team record? All retrospective notes will be permanently removed."
        confirmLabel="Delete Archive"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
