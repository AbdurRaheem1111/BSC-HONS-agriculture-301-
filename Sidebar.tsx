import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  CalendarDays, 
  ClipboardCheck, 
  BarChart3,
  GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/classes', icon: School, label: 'Classes' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/timetable', icon: CalendarDays, label: 'Timetable' },
  { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/register', icon: GraduationCap, label: 'Register' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen sticky top-0 flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">UniAttend</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              "transition-transform duration-200 group-hover:scale-110"
            )} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">Live & Syncing</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
