import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-100 py-4 px-8 flex items-center justify-end sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-600 rounded-full">
              Developer Mode
            </span>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl w-full mx-auto flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
