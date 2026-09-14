/**
 * AWS Student Builder Group - Admin Dashboard Types
 * Module Owner: Member 10 (Admin Dashboard Frontend + Content-Management UI)
 *
 * Domain models and operational types for the admin control room.
 * All domain models are structured to match future backend/API contracts.
 */

// ============================================================================
// 1. Domain Entity Types
// ============================================================================

/**
 * Represents a registered community member in the AWS Student Builder Group.
 */
export interface Member {
  id: string;
  fullName: string;
  email: string;
  role: 'member' | 'lead' | 'co-lead' | 'mentor';
  department: string;
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate';
  avatarUrl?: string;
  joinedDate: string; // ISO 8601 string
  status: 'active' | 'inactive';
}

/**
 * Represents an elected core team member for a specific academic year.
 * Academic year is stored as data to allow dynamic batch additions without code changes.
 */
export interface CoreTeamMember {
  id: string;
  fullName: string;
  designation: string; // e.g. "Cloud Architecture Lead", "Technical Writer"
  academicYear: string; // e.g. "2025-2026", "2024-2025" (Dynamic data representation)
  bio: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  order: number; // Display order within the year
  status: 'current' | 'alumni';
}

/**
 * Represents an AWS SBG community event (workshops, webinars, hackathons, etc.).
 * Events support soft archiving (status: 'archived') rather than requiring permanent deletion.
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'webinar' | 'hackathon' | 'meetup' | 'study_group';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm format
  location: string; // Physical venue or platform
  isVirtual: boolean;
  bannerUrl?: string; // Media URL or Cloudinary CDN link
  registrationLink?: string;
  capacity?: number;
  attendeesCount?: number;
  status: 'upcoming' | 'completed' | 'archived';
  academicYear: string; // e.g. "2025-2026"
}

/**
 * Represents a technical article or blog post published by community authors.
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown or rich text payload
  authorName: string;
  authorRole: string;
  publishedAt: string; // ISO 8601 string
  coverImageUrl?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
}

/**
 * Represents a broadcast announcement for community members or core team.
 */
export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'members' | 'core_team';
  startsAt: string; // ISO 8601 string
  expiresAt?: string; // ISO 8601 string
  isArchived: boolean;
}

/**
 * Represents a curated learning resource or documentation link.
 */
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'cloud_architecture' | 'certification' | 'devops' | 'ai_ml' | 'serverless' | 'security';
  resourceType: 'pdf' | 'link' | 'video' | 'repo';
  url: string;
  addedBy: string;
  createdAt: string; // ISO 8601 string
  isArchived: boolean;
}

/**
 * Represents a student or community-built cloud project.
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  teamMembers: string[];
  techStack: string[];
  repoUrl?: string;
  liveDemoUrl?: string;
  thumbnailImageUrl?: string;
  academicYear: string; // e.g. "2025-2026"
  status: 'in_progress' | 'completed' | 'archived';
}

/**
 * Represents a recognized student achievement, certification, or award.
 */
export interface Achievement {
  id: string;
  title: string;
  recipientName: string;
  category: 'hackathon' | 'certification' | 'community' | 'project';
  description: string;
  date: string; // YYYY-MM-DD
  proofUrl?: string;
  academicYear: string;
  isArchived: boolean;
}

/**
 * Represents historical core team compositions from previous academic batches.
 */
export interface AlumniTeamMember {
  name: string;
  role: string;
  currentCompany?: string;
  linkedinUrl?: string;
}

export interface AlumniTeam {
  id: string;
  academicYear: string; // e.g. "2023-2024", "2024-2025"
  teamLead: string;
  membersCount: number;
  summary: string;
  highlights: string[];
  members: AlumniTeamMember[];
}

/**
 * Represents a photo or media asset in the community gallery.
 */
export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string; // Media URL or Cloudinary CDN asset
  eventName?: string;
  date: string; // YYYY-MM-DD
  category: 'events' | 'workshops' | 'team' | 'hackathons' | 'community';
  isArchived: boolean;
}

// ============================================================================
// 2. Navigation & Operational Types
// ============================================================================

/**
 * The 11 primary sections accessible within the Admin Dashboard.
 */
export type AdminSection =
  | 'overview'
  | 'members'
  | 'core-team'
  | 'events'
  | 'articles'
  | 'announcements'
  | 'resources'
  | 'projects'
  | 'achievements'
  | 'alumni-teams'
  | 'gallery';

/**
 * Aggregated dashboard metrics derived dynamically from repository state.
 */
export interface AdminStats {
  totalMembers: number;
  activeMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  archivedEvents: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalProjects: number;
  inProgressProjects: number;
  totalResources: number;
  totalAnnouncements: number;
  activeAnnouncements: number;
  totalAchievements: number;
  totalGalleryItems: number;
}

/**
 * Audit log entry for tracking recent administrative operations.
 */
export interface ActivityLogItem {
  id: string;
  entityType:
    | 'Member'
    | 'Core Team'
    | 'Event'
    | 'Article'
    | 'Announcement'
    | 'Resource'
    | 'Project'
    | 'Achievement'
    | 'Alumni Team'
    | 'Gallery';
  action: 'created' | 'updated' | 'archived' | 'deleted';
  entityTitle: string;
  performedBy: string;
  timestamp: string; // ISO 8601 string
}

/**
 * Standard parameters for filtering, searching, and paginating entity lists.
 */
export interface FilterParams {
  search?: string;
  status?: string;
  academicYear?: string;
  category?: string;
  page?: number;
  limit?: number;
}

/**
 * Standard state wrapper for asynchronous CRUD views.
 */
export interface CRUDState<T> {
  items: T[];
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  error: string | null;
  successMessage: string | null;
}
