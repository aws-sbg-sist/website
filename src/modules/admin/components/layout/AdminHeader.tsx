import React from 'react';
import { AdminSection } from '../../types';

interface AdminHeaderProps {
  activeSection: AdminSection;
  onOpenMobileMenu?: () => void;
}

const SECTION_TITLES: Record<AdminSection, { title: string; subtitle: string }> = {
  overview: {
    title: 'Dashboard Overview',
    subtitle: 'High-level metrics, active cohorts, and recent administrative activity',
  },
  members: {
    title: 'Members Management',
    subtitle: 'Directory of registered student builders, roles, and status',
  },
  'core-team': {
    title: 'Core Team Management',
    subtitle: 'Leadership members and designation assignments by academic year',
  },
  events: {
    title: 'Events & Workshops',
    subtitle: 'Schedule, manage, and archive technical workshops, hackathons, and webinars',
  },
  articles: {
    title: 'Articles & Editorial',
    subtitle: 'Publish, edit, and curate technical blog posts and guides',
  },
  announcements: {
    title: 'Announcements Broadcast',
    subtitle: 'Send priority alerts to members and core leadership cohorts',
  },
  resources: {
    title: 'Learning Resources',
    subtitle: 'Curated AWS architecture guides, repositories, and study cheat sheets',
  },
  projects: {
    title: 'Student Projects',
    subtitle: 'Showcase community cloud initiatives, prototypes, and GitHub repositories',
  },
  achievements: {
    title: 'Achievements & Awards',
    subtitle: 'Log student certifications, hackathon recognitions, and trophies',
  },
  'alumni-teams': {
    title: 'Alumni Teams Archive',
    subtitle: 'Historical records and retrospectives of past core team batches',
  },
  gallery: {
    title: 'Gallery Media',
    subtitle: 'Manage event photography, workshop snapshots, and banner assets',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeSection,
  onOpenMobileMenu,
}) => {
  const meta = SECTION_TITLES[activeSection] || {
    title: 'Admin Dashboard',
    subtitle: 'AWS Student Builder Group Management',
  };

  return (
    <header className="sticky top-0 z-20 flex flex-col border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      {/* Top Banner indicating Mock State */}
      <div className="flex items-center justify-between bg-amber-500/10 px-4 py-1.5 text-xs text-amber-900 border-b border-amber-500/20">
        <div className="flex items-center space-x-2">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-medium">
            Demo Environment — Mock Data Adapter Active
          </span>
        </div>
        <div className="text-[11px] text-amber-800/80 hidden sm:block">
          Frontend State Decoupled from Real API
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Open sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">{meta.title}</h1>
            <p className="hidden text-xs text-slate-500 sm:block">{meta.subtitle}</p>
          </div>
        </div>

        {/* User Badge / Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
              SB
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-800">Admin Lead</div>
              <div className="text-[10px] text-slate-500">AWS Student Builder</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
