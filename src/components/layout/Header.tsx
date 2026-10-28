import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Bell, Trophy, Shield, ExternalLink, LogOut, User } from 'lucide-react';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/', onNavigate }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-card border-b border-border-grid shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex items-center justify-between gap-gutter">
        {/* Logo & Operational Desk Badge */}
        <div className="flex items-center gap-space-lg">
          <a
            href="#/"
            onClick={(e) => handleNav('/', e)}
            className="flex items-center gap-space-sm group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
              <Trophy className="w-4 h-4 text-primary-fixed" />
            </div>
            <span className="font-headline font-extrabold text-headline-sm text-floodlight-navy tracking-tight uppercase group-hover:text-primary transition-colors">
              Play Field
            </span>
          </a>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-floodlight-navy text-surface-card font-badge-label text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success-emerald animate-pulse"></span>
            Broadcast Desk
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-space-xl">
          <a
            href="#/dashboard"
            onClick={(e) => handleNav('/dashboard', e)}
            className={`font-body text-body-md transition-colors ${
              currentPath === '/dashboard'
                ? 'text-primary font-semibold border-b-2 border-primary-container pb-1'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Dashboard
          </a>
          <a
            href="#/tournaments/ongoing"
            onClick={(e) => handleNav('/tournaments/ongoing', e)}
            className={`font-body text-body-md transition-colors ${
              currentPath === '/tournaments/ongoing'
                ? 'text-primary font-semibold border-b-2 border-primary-container pb-1'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Ongoing Tournaments
          </a>
          <a
            href="#/tournaments/ended"
            onClick={(e) => handleNav('/tournaments/ended', e)}
            className={`font-body text-body-md transition-colors ${
              currentPath === '/tournaments/ended'
                ? 'text-primary font-semibold border-b-2 border-primary-container pb-1'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Ended Tournaments
          </a>
          <a
            href="#/public/tournament/colombo-premier-futsal-2026"
            onClick={(e) => handleNav('/public/tournament/colombo-premier-futsal-2026', e)}
            className={`font-body text-body-md transition-colors flex items-center gap-1 ${
              currentPath.startsWith('/public')
                ? 'text-primary font-semibold border-b-2 border-primary-container pb-1'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Public Live Center</span>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </a>
        </nav>

        {/* Right CTA & Profile cluster */}
        <div className="flex items-center gap-space-md">
          <a
            href="#/tournaments/new/details"
            onClick={(e) => handleNav('/tournaments/new/details', e)}
            className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary hover:bg-pitch-turf-hover active:bg-pitch-turf-active font-subheading text-subheading shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Start Tournament</span>
          </a>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="p-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray transition-colors relative"
            type="button"
            title="Operational Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-card-red-danger"></span>
          </button>

          {/* User Profile / Auth Toggle */}
          <div className="relative border-l border-border-grid pl-space-xs">
            {isAuthenticated ? (
              <div>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary-container transition-all"
                >
                  <img
                    alt={currentUser?.fullName || 'User'}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-border-grid"
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-card rounded-xl shadow-xl border border-border-grid py-2 z-50">
                    <div className="px-4 py-2 border-b border-border-grid">
                      <div className="font-headline font-bold text-sm text-floodlight-navy truncate">
                        {currentUser?.fullName}
                      </div>
                      <div className="font-mono text-xs text-text-muted truncate">
                        {currentUser?.email}
                      </div>
                      <div className="mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-pitch-turf-surface text-status-success-emerald font-mono text-[10px] uppercase font-bold">
                          {currentUser?.role?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <a
                      href="#/dashboard"
                      onClick={(e) => { setShowProfileMenu(false); handleNav('/dashboard', e); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-state-hover-gray"
                    >
                      <User className="w-4 h-4 text-text-muted" />
                      <span>Organizer Desk</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-card-red-danger hover:bg-card-red-surface"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="#/login"
                  onClick={(e) => handleNav('/login', e)}
                  className="font-subheading text-sm text-floodlight-navy hover:text-primary font-semibold"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
