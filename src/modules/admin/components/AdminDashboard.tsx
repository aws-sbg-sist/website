import React, { useState } from 'react';
import { AdminSection } from '../types';
import { AdminShell } from './layout/AdminShell';
import { DashboardOverview } from './overview/DashboardOverview';
import { MembersManager } from './crud/MembersManager';
import { CoreTeamManager } from './crud/CoreTeamManager';
import { EventsManager } from './crud/EventsManager';
import { ArticlesManager } from './crud/ArticlesManager';
import { AnnouncementsManager } from './crud/AnnouncementsManager';
import { ResourcesManager } from './crud/ResourcesManager';
import { ProjectsManager } from './crud/ProjectsManager';
import { AchievementsManager } from './crud/AchievementsManager';
import { AlumniTeamsManager } from './crud/AlumniTeamsManager';
import { GalleryManager } from './crud/GalleryManager';

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  return (
    <AdminShell
      activeSection={activeSection}
      onSelectSection={(section) => setActiveSection(section)}
    >
      {activeSection === 'overview' ? (
        <DashboardOverview
          onNavigateToSection={(section) => setActiveSection(section)}
        />
      ) : activeSection === 'members' ? (
        <MembersManager />
      ) : activeSection === 'core-team' ? (
        <CoreTeamManager />
      ) : activeSection === 'events' ? (
        <EventsManager />
      ) : activeSection === 'articles' ? (
        <ArticlesManager />
      ) : activeSection === 'announcements' ? (
        <AnnouncementsManager />
      ) : activeSection === 'resources' ? (
        <ResourcesManager />
      ) : activeSection === 'projects' ? (
        <ProjectsManager />
      ) : activeSection === 'achievements' ? (
        <AchievementsManager />
      ) : activeSection === 'alumni-teams' ? (
        <AlumniTeamsManager />
      ) : activeSection === 'gallery' ? (
        <GalleryManager />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold capitalize text-slate-900">
                {activeSection.replace('-', ' ')} Management
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                CRUD Interface Scaffold &bull; Ready for Phase 2 implementation
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection('overview')}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              &larr; Back to Overview
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <span className="font-bold">Scaffold Note:</span> The domain model, mock dataset, async repository methods, and validation rules for{' '}
              <span className="font-semibold underline">{activeSection}</span> have been established in{' '}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px]">src/modules/admin/</code>.
              The dedicated CRUD management table, form modal, and Cloudinary upload hand-off for this section will be assembled in Phase 2.
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Return to Dashboard Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};
