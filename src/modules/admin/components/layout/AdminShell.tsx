import React, { useState } from 'react';
import { AdminSection } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminShellProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  activeSection,
  onSelectSection,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-20 bg-slate-950/50 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          activeSection={activeSection}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
