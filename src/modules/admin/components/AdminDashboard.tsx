import React, { useState } from 'react';
import { AdminSection } from '../types';
import { AdminShell } from './layout/AdminShell';
import { DashboardOverview } from './overview/DashboardOverview';

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
