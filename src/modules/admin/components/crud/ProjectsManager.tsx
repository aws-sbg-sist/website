import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Project } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateProjectForm } from '../../schemas';
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

interface ProjectFormData {
  title: string;
  description: string;
  teamMembersInput: string;
  techStackInput: string;
  repoUrl: string;
  liveDemoUrl: string;
  thumbnailImageUrl: string;
  academicYear: string;
  status: Project['status'];
}

const INITIAL_FORM_DATA: ProjectFormData = {
  title: '',
  description: '',
  teamMembersInput: 'Aarav Patel, Sneha Rao',
  techStackInput: 'Next.js, AWS Lambda, DynamoDB, Tailwind CSS',
  repoUrl: '',
  liveDemoUrl: '',
  thumbnailImageUrl: '',
  academicYear: '2025-2026',
  status: 'in_progress',
};

const STATUS_BADGES: Record<Project['status'], string> = {
  in_progress: 'bg-amber-50 text-amber-800 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const ProjectsManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);

  // Delete Confirmation State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects showcase');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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
    const years = Array.from(new Set(projects.map((p) => p.academicYear))).filter(Boolean);
    return years.sort().reverse();
  }, [projects]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teamMembers.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.academicYear.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesYear = yearFilter === 'all' || item.academicYear === yearFilter;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [projects, searchQuery, statusFilter, yearFilter]);

  const isFiltered = searchQuery !== '' || statusFilter !== 'all' || yearFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setYearFilter('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      ...INITIAL_FORM_DATA,
      academicYear: yearFilter !== 'all' ? yearFilter : '2025-2026',
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      teamMembersInput: project.teamMembers.join(', '),
      techStackInput: project.techStack.join(', '),
      repoUrl: project.repoUrl || '',
      liveDemoUrl: project.liveDemoUrl || '',
      thumbnailImageUrl: project.thumbnailImageUrl || '',
      academicYear: project.academicYear,
      status: project.status,
    });
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingProject(null);
    setFormErrors({});
    setModalApiError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    // Validate using pure TypeScript schema validator
    const validation = validateProjectForm({
      title: formData.title,
      description: formData.description,
      academicYear: formData.academicYear,
      repoUrl: formData.repoUrl || undefined,
      liveDemoUrl: formData.liveDemoUrl || undefined,
      thumbnailImageUrl: formData.thumbnailImageUrl || undefined,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const parsedTeam = formData.teamMembersInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const parsedTech = formData.techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingProject) {
        // Update existing project
        await adminRepository.updateProject(editingProject.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          teamMembers: parsedTeam.length > 0 ? parsedTeam : ['Student Builder'],
          techStack: parsedTech.length > 0 ? parsedTech : ['AWS'],
          repoUrl: formData.repoUrl.trim() || undefined,
          liveDemoUrl: formData.liveDemoUrl.trim() || undefined,
          thumbnailImageUrl: formData.thumbnailImageUrl.trim() || undefined,
          academicYear: formData.academicYear.trim(),
          status: formData.status,
        });
        setSuccessMessage(`Project "${formData.title}" updated successfully.`);
      } else {
        // Create new project
        await adminRepository.createProject({
          title: formData.title.trim(),
          description: formData.description.trim(),
          teamMembers: parsedTeam.length > 0 ? parsedTeam : ['Student Builder'],
          techStack: parsedTech.length > 0 ? parsedTech : ['AWS'],
          repoUrl: formData.repoUrl.trim() || undefined,
          liveDemoUrl: formData.liveDemoUrl.trim() || undefined,
          thumbnailImageUrl: formData.thumbnailImageUrl.trim() || undefined,
          academicYear: formData.academicYear.trim(),
          status: formData.status,
        });
        setSuccessMessage(`Project "${formData.title}" created successfully.`);
      }

      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Delete Project Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteProject(projectToDelete.id);
      setSuccessMessage(`Project "${projectToDelete.title}" deleted.`);
      setProjectToDelete(null);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<Project>[] = [
    {
      key: 'title',
      header: 'Project Showcase',
      render: (item) => (
        <div className="flex items-start space-x-3 max-w-sm">
          {item.thumbnailImageUrl ? (
            <img
              src={item.thumbnailImageUrl}
              alt={item.title}
              className="h-10 w-14 rounded-md object-cover border border-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-md bg-slate-900 text-amber-400 font-bold text-xs border border-slate-800">
              AWS
            </div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-slate-900 truncate" title={item.title}>
              {item.title}
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {item.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'teamMembers',
      header: 'Builders / Team',
      render: (item) => (
        <div className="text-[11px] text-slate-700 max-w-[150px] truncate" title={item.teamMembers.join(', ')}>
          {item.teamMembers.join(', ')}
        </div>
      ),
    },
    {
      key: 'techStack',
      header: 'Tech Stack',
      render: (item) => (
        <div className="flex flex-wrap gap-1 max-w-[160px]">
          {item.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700 border border-slate-200"
            >
              {tech}
            </span>
          ))}
          {item.techStack.length > 3 && (
            <span className="text-[9px] text-slate-400">+{item.techStack.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'academicYear',
      header: 'Batch',
      render: (item) => (
        <span className="font-mono text-[11px] font-semibold text-slate-700">
          {item.academicYear}
        </span>
      ),
    },
    {
      key: 'links',
      header: 'Repositories & Demos',
      render: (item) => (
        <div className="flex items-center space-x-2 text-[11px]">
          {item.repoUrl && (
            <a
              href={item.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 hover:text-slate-950 font-medium underline inline-flex items-center space-x-0.5"
              title="GitHub Repository"
            >
              <span>Code</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {item.liveDemoUrl && (
            <a
              href={item.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 font-medium underline inline-flex items-center space-x-0.5"
              title="Live Demo"
            >
              <span>Live</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {!item.repoUrl && !item.liveDemoUrl && (
            <span className="text-slate-400 text-[11px]">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
            STATUS_BADGES[item.status]
          }`}
        >
          {item.status.replace('_', ' ')}
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
            onClick={loadProjects}
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
        searchPlaceholder="Search projects by title, stack, builder, or batch..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={projects.length}
        filteredCount={filteredProjects.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Add Project"
      >
        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="project-status-filter" className="text-xs text-slate-600 font-medium">
            Status:
          </label>
          <select
            id="project-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Dynamic Academic Year Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="project-year-filter" className="text-xs text-slate-600 font-medium">
            Batch:
          </label>
          <select
            id="project-year-filter"
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
      </SearchFilterToolbar>

      {/* Projects Data Table */}
      <CRUDTable
        data={filteredProjects}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching projects found' : 'No student projects recorded'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or status/batch filters.'
            : 'Get started by creating a showcase entry for a student cloud project.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Add / Edit Project) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Student Project' : 'Add Student Project'}
        subtitle={
          editingProject
            ? `Editing "${editingProject.title}"`
            : 'Showcase a student or community cloud project prototype'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingProject ? 'Update Project' : 'Save Project'}
        maxWidthClass="max-w-3xl"
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <FormField
              label="Project Title"
              htmlFor="prj-title"
              required
              error={formErrors.title}
              hint="Minimum 3 characters"
            >
              <TextInput
                id="prj-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Campus Cloud Attendance & Event Check-in System"
                hasError={Boolean(formErrors.title)}
              />
            </FormField>
          </div>

          {/* Academic Year */}
          <FormField
            label="Academic Year Batch"
            htmlFor="prj-year"
            required
            error={formErrors.academicYear}
            hint="Format: YYYY-YYYY"
          >
            <TextInput
              id="prj-year"
              type="text"
              required
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="e.g. 2025-2026"
              hasError={Boolean(formErrors.academicYear)}
            />
          </FormField>

          {/* Status */}
          <FormField
            label="Development Status"
            htmlFor="prj-status"
            required
          >
            <Select
              id="prj-status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ProjectFormData['status'],
                })
              }
            >
              <option value="in_progress">In Progress (Active Prototype)</option>
              <option value="completed">Completed (Production / Shipped)</option>
              <option value="archived">Archived (Legacy)</option>
            </Select>
          </FormField>

          {/* Team Members */}
          <div className="sm:col-span-2">
            <FormField
              label="Student Builders / Team Members"
              htmlFor="prj-team"
              required
              hint="Comma-separated names (e.g. Aarav Patel, Rohan Sharma, Sneha Rao)"
            >
              <TextInput
                id="prj-team"
                type="text"
                required
                value={formData.teamMembersInput}
                onChange={(e) => setFormData({ ...formData, teamMembersInput: e.target.value })}
                placeholder="Aarav Patel, Rohan Sharma, Sneha Rao"
              />
            </FormField>
          </div>

          {/* Tech Stack */}
          <div className="sm:col-span-2">
            <FormField
              label="Tech Stack & AWS Services"
              htmlFor="prj-stack"
              required
              hint="Comma-separated technologies (e.g. Next.js, AWS Amplify, DynamoDB, GraphQL)"
            >
              <TextInput
                id="prj-stack"
                type="text"
                required
                value={formData.techStackInput}
                onChange={(e) => setFormData({ ...formData, techStackInput: e.target.value })}
                placeholder="Next.js, AWS Lambda, DynamoDB, CDK, Tailwind CSS"
              />
            </FormField>
          </div>

          {/* Repo URL */}
          <FormField
            label="GitHub Repository URL"
            htmlFor="prj-repo"
            error={formErrors.repoUrl}
            hint="Optional source code repository link"
          >
            <TextInput
              id="prj-repo"
              type="url"
              value={formData.repoUrl}
              onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
              placeholder="https://github.com/aws-sbg/project"
              hasError={Boolean(formErrors.repoUrl)}
            />
          </FormField>

          {/* Live Demo URL */}
          <FormField
            label="Live Deployment / Demo URL"
            htmlFor="prj-demo"
            error={formErrors.liveDemoUrl}
            hint="Optional live preview URL"
          >
            <TextInput
              id="prj-demo"
              type="url"
              value={formData.liveDemoUrl}
              onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
              placeholder="https://checkin.aws-sbg.org"
              hasError={Boolean(formErrors.liveDemoUrl)}
            />
          </FormField>

          {/* Description */}
          <div className="sm:col-span-2">
            <FormField
              label="Project Description & Architecture"
              htmlFor="prj-desc"
              required
              error={formErrors.description}
              hint="Minimum 15 characters"
            >
              <TextArea
                id="prj-desc"
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe project problem statement, cloud architecture, AWS services utilized, and outcomes..."
                hasError={Boolean(formErrors.description)}
              />
            </FormField>
          </div>

          {/* Thumbnail Media Field */}
          <div className="sm:col-span-2">
            <MediaField
              label="Project Thumbnail / Architecture Diagram URL"
              value={formData.thumbnailImageUrl}
              onChange={(url) => setFormData({ ...formData, thumbnailImageUrl: url })}
              error={formErrors.thumbnailImageUrl}
              placeholder="https://images.unsplash.com/... or CDN link"
              helperText="16:9 aspect ratio preview thumbnail URL or Cloudinary CDN asset link."
              previewHeightClass="h-32"
            />
          </div>
        </div>
      </FormModal>

      {/* Destructive Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Student Project"
        itemTitle={projectToDelete?.title}
        message="Are you sure you want to delete this project from the showcase? This action cannot be undone."
        confirmLabel="Delete Project"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
