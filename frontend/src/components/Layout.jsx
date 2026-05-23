import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleChange = (event) => {
      setIsSidebarOpen(event.matches);
    };

    setIsSidebarOpen(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen overflow-x-hidden">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <Sidebar
          isMobile
          onNavigate={() => setIsSidebarOpen(false)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-100 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10">
          <button
            type="button"
            className="lg:hidden h-10 w-10 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors"
            aria-label="Open navigation menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-600 rounded-full">
              Developer Mode
            </span>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
