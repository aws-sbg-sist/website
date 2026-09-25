/**
 * AWS Student Builder Group - Admin Repository Service (Mock Adapter)
 * Module Owner: Member 10 (Admin Dashboard Frontend + Content-Management UI)
 *
 * ARCHITECTURAL BOUNDARY:
 * UI Components -> Repository Layer -> Mock Data (Now) / Real REST/GraphQL Backend (Later)
 *
 * This service implements the data access layer for the Admin Dashboard.
 * All methods are asynchronous and return cloned data, simulating realistic network
 * latency and isolating the presentation layer from the underlying storage mechanism.
 *
 * In the future, the Technical Lead can swap or adapt this service to call real
 * authenticated API endpoints (e.g. `fetch('/api/admin/...')`) without requiring
 * changes to the UI components.
 */

import {
  Member,
  CoreTeamMember,
  Event,
  Article,
  Announcement,
  Resource,
  Project,
  Achievement,
  AlumniTeam,
  GalleryItem,
  AdminStats,
  ActivityLogItem,
  FilterParams,
} from '../types';

import {
  mockMembers,
  mockCoreTeam,
  mockEvents,
  mockArticles,
  mockAnnouncements,
  mockResources,
  mockProjects,
  mockAchievements,
  mockAlumniTeams,
  mockGalleryItems,
  mockRecentActivities,
} from '../data/mockAdminData';

// Simulated latency helper to mimic asynchronous network roundtrips
const simulateNetworkDelay = (ms: number = 200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Deep clone helper to guarantee state immutability across operations
const deepClone = <T>(item: T): T => JSON.parse(JSON.stringify(item));

/**
 * In-memory state store initialized with mock data fixtures.
 * Mutations persist within the browser runtime session.
 */
class InMemoryAdminStore {
  private members: Member[] = deepClone(mockMembers);
  private coreTeam: CoreTeamMember[] = deepClone(mockCoreTeam);
  private events: Event[] = deepClone(mockEvents);
  private articles: Article[] = deepClone(mockArticles);
  private announcements: Announcement[] = deepClone(mockAnnouncements);
  private resources: Resource[] = deepClone(mockResources);
  private projects: Project[] = deepClone(mockProjects);
  private achievements: Achievement[] = deepClone(mockAchievements);
  private alumniTeams: AlumniTeam[] = deepClone(mockAlumniTeams);
  private gallery: GalleryItem[] = deepClone(mockGalleryItems);
  private activities: ActivityLogItem[] = deepClone(mockRecentActivities);

  // --------------------------------------------------------------------------
  // Audit Logging
  // --------------------------------------------------------------------------
  private logActivity(
    entityType: ActivityLogItem['entityType'],
    action: ActivityLogItem['action'],
    entityTitle: string
  ): void {
    const entry: ActivityLogItem = {
      id: `act-${Date.now()}`,
      entityType,
      action,
      entityTitle,
      performedBy: 'Admin (Local Session)',
      timestamp: new Date().toISOString(),
    };
    this.activities.unshift(entry);
    if (this.activities.length > 20) {
      this.activities.pop();
    }
  }

  // --------------------------------------------------------------------------
  // Dashboard Overview & Metrics
  // --------------------------------------------------------------------------
  async getDashboardStats(): Promise<AdminStats> {
    await simulateNetworkDelay(150);
    return {
      totalMembers: this.members.length,
      activeMembers: this.members.filter((m) => m.status === 'active').length,
      totalEvents: this.events.length,
      upcomingEvents: this.events.filter((e) => e.status === 'upcoming').length,
      archivedEvents: this.events.filter((e) => e.status === 'archived').length,
      totalArticles: this.articles.length,
      publishedArticles: this.articles.filter((a) => a.status === 'published').length,
      draftArticles: this.articles.filter((a) => a.status === 'draft').length,
      totalProjects: this.projects.length,
      inProgressProjects: this.projects.filter((p) => p.status === 'in_progress').length,
      totalResources: this.resources.filter((r) => !r.isArchived).length,
      totalAnnouncements: this.announcements.length,
      activeAnnouncements: this.announcements.filter((a) => !a.isArchived).length,
      totalAchievements: this.achievements.filter((a) => !a.isArchived).length,
      totalGalleryItems: this.gallery.filter((g) => !g.isArchived).length,
    };
  }

  async getRecentActivities(limit: number = 8): Promise<ActivityLogItem[]> {
    await simulateNetworkDelay(150);
    return deepClone(this.activities.slice(0, limit));
  }

  // --------------------------------------------------------------------------
  // 1. Members CRUD
  // --------------------------------------------------------------------------
  async getMembers(params?: FilterParams): Promise<Member[]> {
    await simulateNetworkDelay();
    let result = deepClone(this.members);
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q)
      );
    }
    if (params?.status) {
      result = result.filter((m) => m.status === params.status);
    }
    return result;
  }

  async createMember(payload: Omit<Member, 'id' | 'joinedDate'>): Promise<Member> {
    await simulateNetworkDelay();
    const newMember: Member = {
      ...payload,
      id: `mem-${Date.now()}`,
      joinedDate: new Date().toISOString(),
    };
    this.members.unshift(newMember);
    this.logActivity('Member', 'created', newMember.fullName);
    return deepClone(newMember);
  }

  async updateMember(id: string, payload: Partial<Member>): Promise<Member> {
    await simulateNetworkDelay();
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Member with id '${id}' not found`);
    this.members[index] = { ...this.members[index], ...payload };
    this.logActivity('Member', 'updated', this.members[index].fullName);
    return deepClone(this.members[index]);
  }

  async deleteMember(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Member with id '${id}' not found`);
    const name = this.members[index].fullName;
    this.members.splice(index, 1);
    this.logActivity('Member', 'deleted', name);
    return true;
  }

  // --------------------------------------------------------------------------
  // 2. Core Team CRUD
  // --------------------------------------------------------------------------
  async getCoreTeam(academicYear?: string): Promise<CoreTeamMember[]> {
    await simulateNetworkDelay();
    let list = deepClone(this.coreTeam);
    if (academicYear) {
      list = list.filter((m) => m.academicYear === academicYear);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  async createCoreTeamMember(payload: Omit<CoreTeamMember, 'id'>): Promise<CoreTeamMember> {
    await simulateNetworkDelay();
    const newEntry: CoreTeamMember = {
      ...payload,
      id: `core-${Date.now()}`,
    };
    this.coreTeam.push(newEntry);
    this.logActivity('Core Team', 'created', newEntry.fullName);
    return deepClone(newEntry);
  }

  async updateCoreTeamMember(id: string, payload: Partial<CoreTeamMember>): Promise<CoreTeamMember> {
    await simulateNetworkDelay();
    const index = this.coreTeam.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Core team member with id '${id}' not found`);
    this.coreTeam[index] = { ...this.coreTeam[index], ...payload };
    this.logActivity('Core Team', 'updated', this.coreTeam[index].fullName);
    return deepClone(this.coreTeam[index]);
  }

  async deleteCoreTeamMember(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.coreTeam.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Core team member with id '${id}' not found`);
    const name = this.coreTeam[index].fullName;
    this.coreTeam.splice(index, 1);
    this.logActivity('Core Team', 'deleted', name);
    return true;
  }

  // --------------------------------------------------------------------------
  // 3. Events CRUD (Supports Archival)
  // --------------------------------------------------------------------------
  async getEvents(status?: Event['status']): Promise<Event[]> {
    await simulateNetworkDelay();
    let list = deepClone(this.events);
    if (status) {
      list = list.filter((e) => e.status === status);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createEvent(payload: Omit<Event, 'id'>): Promise<Event> {
    await simulateNetworkDelay();
    const newEvent: Event = {
      ...payload,
      id: `evt-${Date.now()}`,
    };
    this.events.unshift(newEvent);
    this.logActivity('Event', 'created', newEvent.title);
    return deepClone(newEvent);
  }

  async updateEvent(id: string, payload: Partial<Event>): Promise<Event> {
    await simulateNetworkDelay();
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Event with id '${id}' not found`);
    this.events[index] = { ...this.events[index], ...payload };
    this.logActivity('Event', 'updated', this.events[index].title);
    return deepClone(this.events[index]);
  }

  async archiveEvent(id: string): Promise<Event> {
    return this.updateEvent(id, { status: 'archived' });
  }

  async deleteEvent(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Event with id '${id}' not found`);
    const title = this.events[index].title;
    this.events.splice(index, 1);
    this.logActivity('Event', 'deleted', title);
    return true;
  }

  // --------------------------------------------------------------------------
  // 4. Articles CRUD
  // --------------------------------------------------------------------------
  async getArticles(status?: Article['status']): Promise<Article[]> {
    await simulateNetworkDelay();
    let list = deepClone(this.articles);
    if (status) {
      list = list.filter((a) => a.status === status);
    }
    return list;
  }

  async createArticle(payload: Omit<Article, 'id' | 'publishedAt'>): Promise<Article> {
    await simulateNetworkDelay();
    const newArticle: Article = {
      ...payload,
      id: `art-${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
    this.articles.unshift(newArticle);
    this.logActivity('Article', 'created', newArticle.title);
    return deepClone(newArticle);
  }

  async updateArticle(id: string, payload: Partial<Article>): Promise<Article> {
    await simulateNetworkDelay();
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Article with id '${id}' not found`);
    this.articles[index] = { ...this.articles[index], ...payload };
    this.logActivity('Article', 'updated', this.articles[index].title);
    return deepClone(this.articles[index]);
  }

  async deleteArticle(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Article with id '${id}' not found`);
    const title = this.articles[index].title;
    this.articles.splice(index, 1);
    this.logActivity('Article', 'deleted', title);
    return true;
  }

  // --------------------------------------------------------------------------
  // 5. Announcements CRUD
  // --------------------------------------------------------------------------
  async getAnnouncements(): Promise<Announcement[]> {
    await simulateNetworkDelay();
    return deepClone(this.announcements);
  }

  async createAnnouncement(payload: Omit<Announcement, 'id' | 'startsAt'>): Promise<Announcement> {
    await simulateNetworkDelay();
    const item: Announcement = {
      ...payload,
      id: `ann-${Date.now()}`,
      startsAt: new Date().toISOString(),
    };
    this.announcements.unshift(item);
    this.logActivity('Announcement', 'created', item.title);
    return deepClone(item);
  }

  async updateAnnouncement(id: string, payload: Partial<Announcement>): Promise<Announcement> {
    await simulateNetworkDelay();
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Announcement with id '${id}' not found`);
    this.announcements[index] = { ...this.announcements[index], ...payload };
    this.logActivity('Announcement', 'updated', this.announcements[index].title);
    return deepClone(this.announcements[index]);
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Announcement with id '${id}' not found`);
    const title = this.announcements[index].title;
    this.announcements.splice(index, 1);
    this.logActivity('Announcement', 'deleted', title);
    return true;
  }

  // --------------------------------------------------------------------------
  // 6. Resources CRUD
  // --------------------------------------------------------------------------
  async getResources(): Promise<Resource[]> {
    await simulateNetworkDelay();
    return deepClone(this.resources);
  }

  async createResource(payload: Omit<Resource, 'id' | 'createdAt'>): Promise<Resource> {
    await simulateNetworkDelay();
    const item: Resource = {
      ...payload,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.resources.unshift(item);
    this.logActivity('Resource', 'created', item.title);
    return deepClone(item);
  }

  async updateResource(id: string, payload: Partial<Resource>): Promise<Resource> {
    await simulateNetworkDelay();
    const index = this.resources.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Resource with id '${id}' not found`);
    this.resources[index] = { ...this.resources[index], ...payload };
    this.logActivity('Resource', 'updated', this.resources[index].title);
    return deepClone(this.resources[index]);
  }

  async deleteResource(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.resources.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Resource with id '${id}' not found`);
    const title = this.resources[index].title;
    this.resources.splice(index, 1);
    this.logActivity('Resource', 'deleted', title);
    return true;
  }

  // --------------------------------------------------------------------------
  // 7. Projects CRUD
  // --------------------------------------------------------------------------
  async getProjects(): Promise<Project[]> {
    await simulateNetworkDelay();
    return deepClone(this.projects);
  }

  async createProject(payload: Omit<Project, 'id'>): Promise<Project> {
    await simulateNetworkDelay();
    const item: Project = {
      ...payload,
      id: `prj-${Date.now()}`,
    };
    this.projects.unshift(item);
    this.logActivity('Project', 'created', item.title);
    return deepClone(item);
  }

  async updateProject(id: string, payload: Partial<Project>): Promise<Project> {
    await simulateNetworkDelay();
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Project with id '${id}' not found`);
    this.projects[index] = { ...this.projects[index], ...payload };
    this.logActivity('Project', 'updated', this.projects[index].title);
    return deepClone(this.projects[index]);
  }

  async deleteProject(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Project with id '${id}' not found`);
    const title = this.projects[index].title;
    this.projects.splice(index, 1);
    this.logActivity('Project', 'deleted', title);
    return true;
  }

  // --------------------------------------------------------------------------
  // 8. Achievements CRUD
  // --------------------------------------------------------------------------
  async getAchievements(): Promise<Achievement[]> {
    await simulateNetworkDelay();
    return deepClone(this.achievements);
  }

  async createAchievement(payload: Omit<Achievement, 'id'>): Promise<Achievement> {
    await simulateNetworkDelay();
    const item: Achievement = {
      ...payload,
      id: `ach-${Date.now()}`,
    };
    this.achievements.unshift(item);
    this.logActivity('Achievement', 'created', item.title);
    return deepClone(item);
  }

  async updateAchievement(id: string, payload: Partial<Achievement>): Promise<Achievement> {
    await simulateNetworkDelay();
    const index = this.achievements.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Achievement with id '${id}' not found`);
    this.achievements[index] = { ...this.achievements[index], ...payload };
    this.logActivity('Achievement', 'updated', this.achievements[index].title);
    return deepClone(this.achievements[index]);
  }

  async deleteAchievement(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.achievements.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Achievement with id '${id}' not found`);
    const title = this.achievements[index].title;
    this.achievements.splice(index, 1);
    this.logActivity('Achievement', 'deleted', title);
    return true;
  }

  // --------------------------------------------------------------------------
  // 9. Alumni Teams CRUD
  // --------------------------------------------------------------------------
  async getAlumniTeams(): Promise<AlumniTeam[]> {
    await simulateNetworkDelay();
    return deepClone(this.alumniTeams);
  }

  async createAlumniTeam(payload: Omit<AlumniTeam, 'id'>): Promise<AlumniTeam> {
    await simulateNetworkDelay();
    const item: AlumniTeam = {
      ...payload,
      id: `alumni-${Date.now()}`,
    };
    this.alumniTeams.unshift(item);
    this.logActivity('Alumni Team', 'created', `Batch ${item.academicYear}`);
    return deepClone(item);
  }

  async updateAlumniTeam(id: string, payload: Partial<AlumniTeam>): Promise<AlumniTeam> {
    await simulateNetworkDelay();
    const index = this.alumniTeams.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Alumni team with id '${id}' not found`);
    this.alumniTeams[index] = { ...this.alumniTeams[index], ...payload };
    this.logActivity('Alumni Team', 'updated', `Batch ${this.alumniTeams[index].academicYear}`);
    return deepClone(this.alumniTeams[index]);
  }

  async deleteAlumniTeam(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.alumniTeams.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Alumni team with id '${id}' not found`);
    const name = `Batch ${this.alumniTeams[index].academicYear}`;
    this.alumniTeams.splice(index, 1);
    this.logActivity('Alumni Team', 'deleted', name);
    return true;
  }

  // --------------------------------------------------------------------------
  // 10. Gallery CRUD
  // --------------------------------------------------------------------------
  async getGalleryItems(): Promise<GalleryItem[]> {
    await simulateNetworkDelay();
    return deepClone(this.gallery);
  }

  async createGalleryItem(payload: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    await simulateNetworkDelay();
    const item: GalleryItem = {
      ...payload,
      id: `gal-${Date.now()}`,
    };
    this.gallery.unshift(item);
    this.logActivity('Gallery', 'created', item.title);
    return deepClone(item);
  }

  async updateGalleryItem(id: string, payload: Partial<GalleryItem>): Promise<GalleryItem> {
    await simulateNetworkDelay();
    const index = this.gallery.findIndex((g) => g.id === id);
    if (index === -1) throw new Error(`Gallery item with id '${id}' not found`);
    this.gallery[index] = { ...this.gallery[index], ...payload };
    this.logActivity('Gallery', 'updated', this.gallery[index].title);
    return deepClone(this.gallery[index]);
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    await simulateNetworkDelay();
    const index = this.gallery.findIndex((g) => g.id === id);
    if (index === -1) throw new Error(`Gallery item with id '${id}' not found`);
    const title = this.gallery[index].title;
    this.gallery.splice(index, 1);
    this.logActivity('Gallery', 'deleted', title);
    return true;
  }
}

/**
 * Singleton repository instance exported for frontend consumption.
 */
export const adminRepository = new InMemoryAdminStore();
