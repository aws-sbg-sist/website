import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Article } from '../../types';
import { adminRepository } from '../../services/adminRepository';
import { validateArticleForm } from '../../schemas';
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

interface ArticleFormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  authorName: string;
  authorRole: string;
  coverImageUrl: string;
  tagsInput: string;
  status: Article['status'];
}

const INITIAL_FORM_DATA: ArticleFormData = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  authorName: 'Aarav Patel',
  authorRole: 'Community Lead',
  coverImageUrl: '',
  tagsInput: 'AWS, Cloud, Architecture',
  status: 'draft',
};

const STATUS_BADGES: Record<Article['status'], string> = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-50 text-amber-800 border-amber-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
};

// Pure utility helper to generate clean SEO slug from text
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const ArticlesManager: React.FC = () => {
  // --------------------------------------------------------------------------
  // State Management
  // --------------------------------------------------------------------------
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Modal Dialogs State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modalApiError, setModalApiError] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(false);

  // Delete Confirmation State
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminRepository.getArticles();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles list');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Auto-dismiss success notification
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // --------------------------------------------------------------------------
  // Dynamic Tags Extraction
  // --------------------------------------------------------------------------
  const dynamicTags = useMemo(() => {
    const tagsSet = new Set<string>();
    articles.forEach((art) => {
      art.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [articles]);

  // --------------------------------------------------------------------------
  // Client-Side Search & Filtering
  // --------------------------------------------------------------------------
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
      const matchesTag = selectedTag === 'all' || art.tags.includes(selectedTag);

      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [articles, searchQuery, statusFilter, selectedTag]);

  const isFiltered = searchQuery !== '' || statusFilter !== 'all' || selectedTag !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedTag('all');
  };

  // --------------------------------------------------------------------------
  // Form Modal Handlers (Create / Edit)
  // --------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormData(INITIAL_FORM_DATA);
    setIsSlugManuallyEdited(false);
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      authorName: article.authorName,
      authorRole: article.authorRole,
      coverImageUrl: article.coverImageUrl || '',
      tagsInput: article.tags.join(', '),
      status: article.status,
    });
    setIsSlugManuallyEdited(true); // Preserve existing custom slug
    setFormErrors({});
    setModalApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingArticle(null);
    setFormErrors({});
    setModalApiError(null);
  };

  // Title change with automatic slug syncing
  const handleTitleChange = (newTitle: string) => {
    if (!isSlugManuallyEdited) {
      setFormData((prev) => ({
        ...prev,
        title: newTitle,
        slug: slugify(newTitle),
      }));
    } else {
      setFormData((prev) => ({ ...prev, title: newTitle }));
    }
  };

  // Slug change
  const handleSlugChange = (newSlug: string) => {
    setIsSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: slugify(newSlug) }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalApiError(null);

    // Validate using pure TypeScript schema validator
    const validation = validateArticleForm({
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      content: formData.content,
      authorName: formData.authorName,
      coverImageUrl: formData.coverImageUrl || undefined,
    });

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const parsedTags = formData.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingArticle) {
        // Update existing article
        await adminRepository.updateArticle(editingArticle.id, {
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          summary: formData.summary.trim(),
          content: formData.content.trim(),
          authorName: formData.authorName.trim(),
          authorRole: formData.authorRole.trim() || 'Contributor',
          coverImageUrl: formData.coverImageUrl.trim() || undefined,
          tags: parsedTags.length > 0 ? parsedTags : ['General'],
          status: formData.status,
        });
        setSuccessMessage(`Article "${formData.title}" updated successfully.`);
      } else {
        // Create new article
        await adminRepository.createArticle({
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          summary: formData.summary.trim(),
          content: formData.content.trim(),
          authorName: formData.authorName.trim(),
          authorRole: formData.authorRole.trim() || 'Contributor',
          coverImageUrl: formData.coverImageUrl.trim() || undefined,
          tags: parsedTags.length > 0 ? parsedTags : ['AWS'],
          status: formData.status,
        });
        setSuccessMessage(`Article "${formData.title}" created successfully.`);
      }

      setIsModalOpen(false);
      await loadArticles();
    } catch (err) {
      setModalApiError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // Delete Article Handlers
  // --------------------------------------------------------------------------
  const handleOpenDeleteDialog = (article: Article) => {
    setArticleToDelete(article);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;

    setIsDeleting(true);
    try {
      await adminRepository.deleteArticle(articleToDelete.id);
      setSuccessMessage(`Article "${articleToDelete.title}" deleted.`);
      setArticleToDelete(null);
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Table Columns Definition
  // --------------------------------------------------------------------------
  const columns: Column<Article>[] = [
    {
      key: 'title',
      header: 'Article / Story',
      render: (art) => (
        <div className="flex items-start space-x-3 max-w-md">
          {art.coverImageUrl ? (
            <img
              src={art.coverImageUrl}
              alt={art.title}
              className="h-10 w-14 rounded-md object-cover border border-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400 border border-slate-200">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-slate-900 truncate" title={art.title}>
              {art.title}
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {art.summary}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (art) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">{art.authorName}</div>
          <div className="text-[10px] text-slate-500">{art.authorRole}</div>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'Slug / URL Path',
      render: (art) => (
        <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[150px] inline-block" title={`/articles/${art.slug}`}>
          /{art.slug}
        </span>
      ),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (art) => (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {art.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800 border border-amber-200"
            >
              #{tag}
            </span>
          ))}
          {art.tags.length > 3 && (
            <span className="text-[9px] text-slate-400">+{art.tags.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (art) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
            STATUS_BADGES[art.status]
          }`}
        >
          {art.status}
        </span>
      ),
    },
    {
      key: 'publishedAt',
      header: 'Published',
      render: (art) => (
        <span className="text-slate-500 text-[11px]">
          {new Date(art.publishedAt).toLocaleDateString()}
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
            onClick={loadArticles}
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
        searchPlaceholder="Search articles by title, author, slug, or tag..."
        onReset={handleResetFilters}
        isFiltered={isFiltered}
        totalCount={articles.length}
        filteredCount={filteredArticles.length}
        onAddNew={handleOpenCreateModal}
        addNewLabel="+ Write Article"
      >
        {/* Status Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="article-status-filter" className="text-xs text-slate-600 font-medium">
            Status:
          </label>
          <select
            id="article-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Dynamic Tag Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="article-tag-filter" className="text-xs text-slate-600 font-medium">
            Tag:
          </label>
          <select
            id="article-tag-filter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="all">All Tags ({dynamicTags.length})</option>
            {dynamicTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      </SearchFilterToolbar>

      {/* Articles Table */}
      <CRUDTable
        data={filteredArticles}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle={isFiltered ? 'No matching articles' : 'No articles published'}
        emptyMessage={
          isFiltered
            ? 'Try adjusting your search query or tag/status filters.'
            : 'Get started by publishing your first technical guide or architecture blog.'
        }
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        actionsColumnHeader="Actions"
      />

      {/* Form Modal (Write / Edit Article) */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingArticle ? 'Edit Technical Article' : 'Write New Article'}
        subtitle={
          editingArticle
            ? `Editing "${editingArticle.title}"`
            : 'Draft a technical tutorial, study guide, or cloud architecture post'
        }
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
        submitLabel={editingArticle ? 'Update Article' : 'Save Article'}
        maxWidthClass="max-w-3xl"
        error={modalApiError}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <FormField
              label="Article Title"
              htmlFor="article-title"
              required
              error={formErrors.title}
              hint="Minimum 5 characters"
            >
              <TextInput
                id="article-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Architecting Event-Driven Systems on AWS with EventBridge"
                hasError={Boolean(formErrors.title)}
              />
            </FormField>
          </div>

          {/* Slug */}
          <div className="sm:col-span-2">
            <FormField
              label="URL Slug"
              htmlFor="article-slug"
              required
              error={formErrors.slug}
              hint="Lowercase letters, numbers, and hyphens only"
            >
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-mono text-xs">
                  /articles/
                </span>
                <TextInput
                  id="article-slug"
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="pl-20 font-mono"
                  placeholder="architecting-event-driven-systems"
                  hasError={Boolean(formErrors.slug)}
                />
              </div>
            </FormField>
          </div>

          {/* Author Name */}
          <FormField
            label="Author Name"
            htmlFor="article-author"
            required
            error={formErrors.authorName}
          >
            <TextInput
              id="article-author"
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              placeholder="e.g. Aarav Patel"
              hasError={Boolean(formErrors.authorName)}
            />
          </FormField>

          {/* Author Role */}
          <FormField
            label="Author Role / Title"
            htmlFor="article-author-role"
            hint="e.g. Community Lead, Technical Writer"
          >
            <TextInput
              id="article-author-role"
              type="text"
              value={formData.authorRole}
              onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
              placeholder="e.g. Community Lead"
            />
          </FormField>

          {/* Status */}
          <FormField
            label="Publication Status"
            htmlFor="article-status"
            required
          >
            <Select
              id="article-status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ArticleFormData['status'],
                })
              }
            >
              <option value="draft">Draft (Under Review)</option>
              <option value="published">Published (Live to Community)</option>
              <option value="archived">Archived (Historical)</option>
            </Select>
          </FormField>

          {/* Tags */}
          <FormField
            label="Tags & Taxonomy"
            htmlFor="article-tags"
            hint="Comma-separated (e.g. Serverless, DynamoDB, Tutorial)"
          >
            <TextInput
              id="article-tags"
              type="text"
              value={formData.tagsInput}
              onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
              placeholder="Serverless, Architecture, AWS, Lambda"
            />
          </FormField>

          {/* Summary */}
          <div className="sm:col-span-2">
            <FormField
              label="Article Excerpt / Summary"
              htmlFor="article-summary"
              required
              error={formErrors.summary}
              hint="Minimum 15 characters"
            >
              <TextArea
                id="article-summary"
                rows={2}
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="A concise synopsis of key concepts, architectures, or lessons covered..."
                hasError={Boolean(formErrors.summary)}
              />
            </FormField>
          </div>

          {/* Content (Markdown Textarea) */}
          <div className="sm:col-span-2">
            <FormField
              label="Article Content (Markdown / Text Body)"
              htmlFor="article-content"
              required
              error={formErrors.content}
              hint="Minimum 20 characters • Markdown syntax supported"
            >
              <TextArea
                id="article-content"
                rows={6}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your technical article body in Markdown here..."
                hasError={Boolean(formErrors.content)}
                className="font-mono text-[11px]"
              />
            </FormField>
          </div>

          {/* Cover Image Media Field */}
          <div className="sm:col-span-2">
            <MediaField
              label="Cover Hero Image URL"
              value={formData.coverImageUrl}
              onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
              error={formErrors.coverImageUrl}
              placeholder="https://images.unsplash.com/... or CDN link"
              helperText="16:9 aspect ratio cover image URL or Cloudinary CDN asset link."
              previewHeightClass="h-32"
            />
          </div>
        </div>
      </FormModal>

      {/* Destructive Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(articleToDelete)}
        onClose={() => setArticleToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Technical Article"
        itemTitle={articleToDelete?.title}
        message="Are you sure you want to permanently delete this article? This action cannot be undone."
        confirmLabel="Delete Article"
        variant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};
