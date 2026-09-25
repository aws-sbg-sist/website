import React, { useEffect, useState } from 'react';
import { AdminSection, AdminStats, ActivityLogItem } from '../../types';
import { adminRepository } from '../../services/adminRepository';

interface DashboardOverviewProps {
  onNavigateToSection: (section: AdminSection) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateToSection,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedStats, fetchedActivities] = await Promise.all([
        adminRepository.getDashboardStats(),
        adminRepository.getRecentActivities(6),
      ]);
      setStats(fetchedStats);
      setActivities(fetchedActivities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3 rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
        <div className="text-sm font-medium text-slate-600">Loading admin metrics from repository...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
        <h3 className="text-base font-semibold">Error Loading Dashboard</h3>
        <p className="mt-1 text-sm">{error || 'An unexpected error occurred.'}</p>
        <button
          type="button"
          onClick={fetchDashboardData}
          className="mt-4 rounded-md bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Members',
      count: stats.totalMembers,
      subtext: `${stats.activeMembers} active students`,
      section: 'members' as AdminSection,
      color: 'border-l-blue-500',
    },
    {
      title: 'Events Scheduled',
      count: stats.totalEvents,
      subtext: `${stats.upcomingEvents} upcoming, ${stats.archivedEvents} archived`,
      section: 'events' as AdminSection,
      color: 'border-l-amber-500',
    },
    {
      title: 'Articles & Guides',
      count: stats.totalArticles,
      subtext: `${stats.publishedArticles} published, ${stats.draftArticles} drafts`,
      section: 'articles' as AdminSection,
      color: 'border-l-emerald-500',
    },
    {
      title: 'Student Projects',
      count: stats.totalProjects,
      subtext: `${stats.inProgressProjects} active prototypes`,
      section: 'projects' as AdminSection,
      color: 'border-l-purple-500',
    },
    {
      title: 'Learning Resources',
      count: stats.totalResources,
      subtext: 'Curated AWS guides & cheat sheets',
      section: 'resources' as AdminSection,
      color: 'border-l-cyan-500',
    },
    {
      title: 'Announcements',
      count: stats.totalAnnouncements,
      subtext: `${stats.activeAnnouncements} active broadcasts`,
      section: 'announcements' as AdminSection,
      color: 'border-l-rose-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-900 text-sm">
              Scaffold Overview
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Metrics are dynamically calculated by the in-memory mock repository adapter for Member 10 frontend verification.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="self-start sm:self-auto text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-md transition-colors"
          >
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-lg border border-slate-200 border-l-4 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <button
                type="button"
                onClick={() => onNavigateToSection(card.section)}
                className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 hover:underline"
              >
                Manage &rarr;
              </button>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{card.count}</div>
            <div className="mt-1 text-xs text-slate-500">{card.subtext}</div>
          </div>
        ))}
      </div>

      {/* Two-column Layout: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions Panel */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Quick Actions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Shortcut triggers to jump into entity management
          </p>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => onNavigateToSection('events')}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <span>Schedule New Event</span>
              <span className="text-slate-400">&rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToSection('articles')}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <span>Write Technical Article</span>
              <span className="text-slate-400">&rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToSection('announcements')}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <span>Broadcast Announcement</span>
              <span className="text-slate-400">&rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToSection('members')}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <span>Review Member Roster</span>
              <span className="text-slate-400">&rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToSection('core-team')}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <span>Manage Core Team Batches</span>
              <span className="text-slate-400">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Recent Activity Audit Feed */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Recent Administrative Activity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit log of recent operations recorded during this session
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {activities.length} entries
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {activities.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No activity recorded yet.
              </div>
            ) : (
              activities.map((act) => {
                const badgeColor =
                  act.action === 'created'
                    ? 'bg-emerald-100 text-emerald-800'
                    : act.action === 'updated'
                    ? 'bg-blue-100 text-blue-800'
                    : act.action === 'archived'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800';

                return (
                  <div key={act.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeColor}`}
                      >
                        {act.action}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium text-slate-900">
                          <span className="text-slate-500">{act.entityType}:</span>{' '}
                          {act.entityTitle}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          By {act.performedBy}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 whitespace-nowrap ml-4">
                      {new Date(act.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
