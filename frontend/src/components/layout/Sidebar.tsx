import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Sparkles,
  LogOut,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks: NavItem[] = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/complaints/new', label: 'Raise Complaint', icon: PlusCircle },
    { to: '/student/complaints', label: 'My Complaints', icon: ListOrdered },
  ];

  const adminLinks: NavItem[] = [
    { to: '/admin/dashboard', label: 'Operations Overview', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Manage Complaints', icon: ListOrdered },
    { to: '/admin/ai-insights', label: 'AI Campus Insights', icon: Sparkles, badge: 'AI' },
  ];

  const navLinks: NavItem[] = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-border/80 bg-card/60 backdrop-blur-md min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-sm shadow-sm">
            {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
            {isAdmin ? 'Administration' : 'Student Portal'}
          </p>

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/student/dashboard' || item.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-foreground text-background shadow-md font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-muted text-foreground border border-border">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Logout */}
      <div className="pt-4 border-t border-border space-y-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
