import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Clock, CalendarDays, BarChart, X } from 'lucide-react';

const Sidebar = ({ isMobile = false, onNavigate, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart },
    { name: 'Event Types', path: '/events', icon: Clock },
    { name: 'Availability', path: '/availability', icon: CalendarDays },
    { name: 'Meetings', path: '/meetings', icon: Calendar },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-40 ${
        isMobile
          ? 'fixed left-0 top-0 w-72 max-w-[85vw] shadow-2xl'
          : 'w-64 lg:w-72'
      }`}
    >
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <div>
            <h1 className="font-bold text-slate-800 tracking-tight leading-none text-base">EasySchedule</h1>
            <span className="text-xs text-slate-400 font-medium">Calendly Clone</span>
          </div>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-500 shadow-sm shadow-brand-100/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <Icon className="h-5 w-5 stroke-[2]" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <div className="h-9 w-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-semibold text-sm">
            JD
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-700">John</h4>
            <span className="text-[10px] text-slate-400 font-medium">john@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
