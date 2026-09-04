import React from 'react';
import { AdminSection } from '../../types';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: AdminSection;
  label: string;
  category: 'core' | 'content' | 'community';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Dashboard Overview', category: 'core' },
  { id: 'members', label: 'Members', category: 'community' },
  { id: 'core-team', label: 'Core Team', category: 'community' },
  { id: 'events', label: 'Events & Workshops', category: 'content' },
  { id: 'articles', label: 'Articles & Blogs', category: 'content' },
  { id: 'announcements', label: 'Announcements', category: 'content' },
  { id: 'resources', label: 'Learning Resources', category: 'content' },
  { id: 'projects', label: 'Student Projects', category: 'content' },
  { id: 'achievements', label: 'Achievements', category: 'community' },
  { id: 'alumni-teams', label: 'Alumni Teams', category: 'community' },
  { id: 'gallery', label: 'Gallery Media', category: 'content' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-900 text-slate-200 border-r border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 text-slate-950 font-bold text-sm">
            AWS
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-white">SBG Admin</div>
            <div className="text-[11px] text-amber-400 font-medium">Content Control Room</div>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close menu"
          >
            <span className="text-xl font-bold">&times;</span>
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.filter((i) => i.category === 'core').map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Content Management
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.filter((i) => i.category === 'content').map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Community & Team
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.filter((i) => i.category === 'community').map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Info */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/40">
        <div className="rounded border border-slate-800 bg-slate-900/80 p-2.5 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-200">Mode:</span> Mock Adapter Active
          <div className="text-[10px] text-slate-400 mt-0.5">Frontend Scaffold • Member 10</div>
        </div>
      </div>
    </aside>
  );
};
