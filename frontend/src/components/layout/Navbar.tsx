import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import {
  GraduationCap,
  Sparkles,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                CampusCare
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-muted text-foreground border border-border">
                AI
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium hidden sm:block">
              Smart Campus Operations
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-muted"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {!isAdmin && (
                <Link to="/student/complaints/new">
                  <Button size="sm" className="gap-1.5 shadow-sm rounded-xl">
                    <PlusCircle className="w-4 h-4" />
                    Raise Complaint
                  </Button>
                </Link>
              )}

              {isAdmin && (
                <Link to="/admin/ai-insights">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs rounded-xl border-border">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Campus Insights
                  </Button>
                </Link>
              )}

              {/* User badge */}
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-muted border border-border text-foreground flex items-center justify-center font-bold text-xs">
                  {user?.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold leading-tight text-foreground truncate max-w-[120px]">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {isAdmin ? 'Campus Admin' : 'Student'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="shadow-sm rounded-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/60">
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium rounded-xl text-foreground hover:bg-accent"
                >
                  Dashboard Overview
                </Link>
                {!isAdmin && (
                  <>
                    <Link
                      to="/student/complaints/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium rounded-xl text-foreground hover:bg-accent"
                    >
                      Raise New Issue
                    </Link>
                    <Link
                      to="/student/complaints"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium rounded-xl text-foreground hover:bg-accent"
                    >
                      My Issue History
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/complaints"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium rounded-xl text-foreground hover:bg-accent"
                    >
                      Manage All Complaints
                    </Link>
                    <Link
                      to="/admin/ai-insights"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium rounded-xl text-foreground hover:bg-accent"
                    >
                      AI Campus Insights
                    </Link>
                  </>
                )}
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full mt-2 rounded-xl"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-xl">Register</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
