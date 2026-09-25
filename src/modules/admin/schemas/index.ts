/**
 * AWS Student Builder Group - Admin Form Validation Schemas & Rules
 * Module Owner: Member 10 (Admin Dashboard Frontend + Content-Management UI)
 *
 * VALIDATION ARCHITECTURE:
 * This file establishes the field-level validation rules, error message constants,
 * and pure TypeScript validation functions for all 10 admin entities.
 *
 * When `zod` and `@hookform/resolvers` are installed by the Technical Lead,
 * these rule contracts map 1-to-1 to Zod schemas (e.g. `z.object({ ... })`).
 *
 * NOTE: Client-side validation improves user experience; the backend/API must
 * always enforce authoritative validation independently.
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

// ============================================================================
// Common Validation Helpers
// ============================================================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true; // Optional URLs pass if empty
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidAcademicYear = (year: string): boolean => {
  // Expected format: YYYY-YYYY (e.g. "2025-2026")
  const yearRegex = /^\d{4}-\d{4}$/;
  return yearRegex.test(year.trim());
};

// ============================================================================
// Entity Validation Schemas
// ============================================================================

/**
 * Member Form Validation
 */
export const validateMemberForm = (data: {
  fullName?: string;
  email?: string;
  role?: string;
  department?: string;
  yearOfStudy?: string;
  avatarUrl?: string;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required (minimum 2 characters).';
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'A valid university email address is required.';
  }
  if (!data.role) {
    errors.role = 'Member role is required.';
  }
  if (!data.department || data.department.trim().length < 2) {
    errors.department = 'Department name is required.';
  }
  if (!data.yearOfStudy) {
    errors.yearOfStudy = 'Year of study is required.';
  }
  if (data.avatarUrl && !isValidUrl(data.avatarUrl)) {
    errors.avatarUrl = 'Avatar must be a valid URL (http:// or https://).';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Event Form Validation
 */
export const validateEventForm = (data: {
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  academicYear?: string;
  bannerUrl?: string;
  registrationLink?: string;
  capacity?: number;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Event title is required (minimum 5 characters).';
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Event description is required (minimum 10 characters).';
  }
  if (!data.category) {
    errors.category = 'Event category must be selected.';
  }
  if (!data.date) {
    errors.date = 'Event date is required (YYYY-MM-DD).';
  }
  if (!data.time || data.time.trim().length < 2) {
    errors.time = 'Event time is required (e.g., 14:00 - 17:00 IST).';
  }
  if (!data.location || data.location.trim().length < 2) {
    errors.location = 'Venue or virtual meeting link description is required.';
  }
  if (!data.academicYear || !isValidAcademicYear(data.academicYear)) {
    errors.academicYear = 'Academic year must be formatted as YYYY-YYYY (e.g. 2025-2026).';
  }
  if (data.bannerUrl && !isValidUrl(data.bannerUrl)) {
    errors.bannerUrl = 'Banner URL must be a valid http/https link.';
  }
  if (data.registrationLink && !isValidUrl(data.registrationLink)) {
    errors.registrationLink = 'Registration link must be a valid URL.';
  }
  if (data.capacity !== undefined && data.capacity <= 0) {
    errors.capacity = 'Capacity must be a positive integer.';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Core Team Form Validation
 */
export const validateCoreTeamForm = (data: {
  fullName?: string;
  designation?: string;
  academicYear?: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required.';
  }
  if (!data.designation || data.designation.trim().length < 2) {
    errors.designation = 'Designation/role is required (e.g. Technical Operations Lead).';
  }
  if (!data.academicYear || !isValidAcademicYear(data.academicYear)) {
    errors.academicYear = 'Academic year is required (format: YYYY-YYYY).';
  }
  if (!data.bio || data.bio.trim().length < 10) {
    errors.bio = 'Short biography is required (minimum 10 characters).';
  }
  if (data.avatarUrl && !isValidUrl(data.avatarUrl)) {
    errors.avatarUrl = 'Avatar must be a valid URL.';
  }
  if (data.linkedinUrl && !isValidUrl(data.linkedinUrl)) {
    errors.linkedinUrl = 'LinkedIn URL must be valid.';
  }
  if (data.githubUrl && !isValidUrl(data.githubUrl)) {
    errors.githubUrl = 'GitHub profile URL must be valid.';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Article Form Validation
 */
export const validateArticleForm = (data: {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  authorName?: string;
  coverImageUrl?: string;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Article title is required (minimum 5 characters).';
  }
  if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug is required and must contain only lowercase alphanumeric characters and hyphens.';
  }
  if (!data.summary || data.summary.trim().length < 15) {
    errors.summary = 'Summary is required (minimum 15 characters).';
  }
  if (!data.content || data.content.trim().length < 20) {
    errors.content = 'Article body content is required.';
  }
  if (!data.authorName || data.authorName.trim().length < 2) {
    errors.authorName = 'Author name is required.';
  }
  if (data.coverImageUrl && !isValidUrl(data.coverImageUrl)) {
    errors.coverImageUrl = 'Cover image URL must be a valid link.';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Announcement Form Validation
 */
export const validateAnnouncementForm = (data: {
  title?: string;
  message?: string;
  priority?: string;
  targetAudience?: string;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Announcement title is required.';
  }
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Announcement message is required (minimum 10 characters).';
  }
  if (!data.priority) {
    errors.priority = 'Priority level must be selected.';
  }
  if (!data.targetAudience) {
    errors.targetAudience = 'Target audience must be specified.';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Resource Form Validation
 */
export const validateResourceForm = (data: {
  title?: string;
  description?: string;
  category?: string;
  resourceType?: string;
  url?: string;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Resource title is required.';
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Resource description is required.';
  }
  if (!data.category) {
    errors.category = 'Category must be selected.';
  }
  if (!data.resourceType) {
    errors.resourceType = 'Resource type must be selected.';
  }
  if (!data.url || !isValidUrl(data.url)) {
    errors.url = 'A valid resource URL is required.';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Project Form Validation
 */
export const validateProjectForm = (data: {
  title?: string;
  description?: string;
  academicYear?: string;
  repoUrl?: string;
  liveDemoUrl?: string;
  thumbnailImageUrl?: string;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Project title is required.';
  }
  if (!data.description || data.description.trim().length < 15) {
    errors.description = 'Project description is required.';
  }
  if (!data.academicYear || !isValidAcademicYear(data.academicYear)) {
    errors.academicYear = 'Academic year is required (format: YYYY-YYYY).';
  }
  if (data.repoUrl && !isValidUrl(data.repoUrl)) {
    errors.repoUrl = 'Repository URL must be a valid link.';
  }
  if (data.liveDemoUrl && !isValidUrl(data.liveDemoUrl)) {
    errors.liveDemoUrl = 'Live demo URL must be a valid link.';
  }
  if (data.thumbnailImageUrl && !isValidUrl(data.thumbnailImageUrl)) {
    errors.thumbnailImageUrl = 'Thumbnail URL must be valid.';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Achievement Form Validation
 */
export const validateAchievementForm = (data: {
  title?: string;
  recipientName?: string;
  category?: string;
  description?: string;
  date?: string;
  proofUrl?: string;
  academicYear?: string;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Achievement title is required (minimum 3 characters).';
  }
  if (!data.recipientName || data.recipientName.trim().length < 2) {
    errors.recipientName = 'Recipient name is required (minimum 2 characters).';
  }
  if (!data.category) {
    errors.category = 'Category must be selected.';
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Achievement description is required (minimum 10 characters).';
  }
  if (!data.date) {
    errors.date = 'Date is required (YYYY-MM-DD).';
  }
  if (!data.academicYear || !isValidAcademicYear(data.academicYear)) {
    errors.academicYear = 'Academic year must be formatted as YYYY-YYYY (e.g. 2025-2026).';
  }
  if (data.proofUrl && !isValidUrl(data.proofUrl)) {
    errors.proofUrl = 'Verification proof link must be a valid URL.';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Gallery Form Validation
 */
export const validateGalleryForm = (data: {
  title?: string;
  imageUrl?: string;
  category?: string;
  date?: string;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Photo title is required.';
  }
  if (!data.imageUrl || !isValidUrl(data.imageUrl)) {
    errors.imageUrl = 'Image URL or Cloudinary CDN asset link is required.';
  }
  if (!data.category) {
    errors.category = 'Category must be selected.';
  }
  if (!data.date) {
    errors.date = 'Date is required (YYYY-MM-DD).';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Alumni Team Form Validation
 */
export const validateAlumniTeamForm = (data: {
  academicYear?: string;
  teamLead?: string;
  summary?: string;
  membersCount?: number;
}): ValidationResult<typeof data> => {
  const errors: Record<string, string> = {};

  if (!data.academicYear || !isValidAcademicYear(data.academicYear)) {
    errors.academicYear = 'Academic year must be formatted as YYYY-YYYY (e.g. 2024-2025).';
  }
  if (!data.teamLead || data.teamLead.trim().length < 2) {
    errors.teamLead = 'Community team lead name is required (minimum 2 characters).';
  }
  if (!data.summary || data.summary.trim().length < 15) {
    errors.summary = 'Batch summary/retrospective is required (minimum 15 characters).';
  }
  if (data.membersCount !== undefined && data.membersCount <= 0) {
    errors.membersCount = 'Members count must be a positive integer.';
  }

  return {
    success: Object.keys(errors).length === 0,
    data: Object.keys(errors).length === 0 ? data : undefined,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};
