import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTournament } from '../../context/TournamentContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import {
  PlusCircle, Bell, Trophy, ExternalLink, LogOut, User,
  CheckCheck, Trash2, X, ArrowRightLeft, Radio, AlertOctagon,
  UserCheck, CalendarClock, Info
} from 'lucide-react';
import { AppNotification, NotificationType } from '../../types/notification';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'RELOCATION':
      return <ArrowRightLeft className="w-4 h-4 text-sky-600" />;
    case 'LIVE':
      return <Radio className="w-4 h-4 text-live-orange animate-pulse" />;
    case 'WALKOVER':
      return <AlertOctagon className="w-4 h-4 text-card-red-danger" />;
    case 'DELEGATION':
      return <UserCheck className="w-4 h-4 text-status-success-emerald" />;
    case 'SCHEDULE':
      return <CalendarClock className="w-4 h-4 text-indigo-600" />;
    case 'SYSTEM':
    default:
      return <Info className="w-4 h-4 text-slate-600" />;
  }
};

const getNotificationIconBg = (type: NotificationType) => {
  switch (type) {
    case 'RELOCATION':
      return 'bg-sky-50 border-sky-200';
    case 'LIVE':
      return 'bg-orange-50 border-orange-200';
    case 'WALKOVER':
      return 'bg-red-50 border-red-200';
    case 'DELEGATION':
      return 'bg-emerald-50 border-emerald-200';
    case 'SCHEDULE':
      return 'bg-indigo-50 border-indigo-200';
    case 'SYSTEM':
    default:
      return 'bg-slate-50 border-slate-200';
  }
};

export const Header: React.FC<HeaderProps> = ({ currentPath = '/', onNavigate }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    removeNotification
  } = useTournament();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  const handleNotificationClick = (notif: AppNotification, e: React.MouseEvent) => {
    markNotificationAsRead(notif.id);
    setShowNotifications(false);
    if (notif.linkUrl) {
      handleNav(notif.linkUrl, e);
    }
  };

  const displayedNotifications = filterTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  if (!isAuthenticated || currentPath.startsWith('/public')) {
    return null;
  }

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
            {t('nav.dashboard')}
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
            {t('nav.ongoing')}
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
            {t('nav.ended')}
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
            <span>{t('nav.publicLive')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </a>
        </nav>

        {/* Right CTA & Profile cluster */}
        <div className="flex items-center gap-space-md">
          {/* Multi-language Selector */}
          <LanguageSelector variant="light" />

          <a
            href="#/tournaments/new/details"
            onClick={(e) => handleNav('/tournaments/new/details', e)}
            className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary hover:bg-pitch-turf-hover active:bg-pitch-turf-active font-button text-sm font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('nav.startTournament')}</span>
          </a>

          {/* Notifications Center */}
          <div className="relative" ref={notifRef}>
            <button
              aria-expanded={showNotifications}
              onClick={() => setShowNotifications(prev => !prev)}
              className={`p-space-xs rounded-lg transition-all relative ${
                showNotifications
                  ? 'bg-state-hover-gray text-primary ring-2 ring-primary-container/30'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-state-hover-gray'
              }`}
              type="button"
              aria-label={`Operational Notifications: ${unreadNotificationCount} unread`}
              title="Operational Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-live-orange text-surface-card font-badge-label text-[10px] font-bold shadow-sm animate-pulse">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface-card rounded-2xl shadow-2xl border border-border-grid overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Popover Header */}
                <div className="p-4 border-b border-border-grid bg-canvas-alabaster">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-status-success-emerald animate-pulse"></div>
                      <h3 className="font-headline font-bold text-headline-sm text-floodlight-navy text-sm">
                        Operational Desk Alerts
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadNotificationCount > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllNotificationsAsRead()}
                          title="Mark all as read"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-button font-medium text-primary hover:bg-pitch-turf-surface transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={() => clearAllNotifications()}
                          title="Clear all alerts"
                          className="inline-flex items-center gap-1 p-1 rounded text-xs font-button text-text-muted hover:text-card-red-danger hover:bg-card-red-surface transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-surface-card rounded-lg border border-border-grid">
                    <button
                      type="button"
                      onClick={() => setFilterTab('all')}
                      className={`flex-1 py-1 px-2.5 rounded text-xs font-button font-semibold transition-all ${
                        filterTab === 'all'
                          ? 'bg-floodlight-navy text-surface-card shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab('unread')}
                      className={`flex-1 py-1 px-2.5 rounded text-xs font-button font-semibold transition-all ${
                        filterTab === 'unread'
                          ? 'bg-floodlight-navy text-surface-card shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Unread ({unreadNotificationCount})
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-border-grid">
                  {displayedNotifications.length === 0 ? (
                    <div className="py-10 px-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-canvas-alabaster flex items-center justify-center text-text-muted">
                        <Bell className="w-6 h-6 opacity-40" />
                      </div>
                      <p className="font-headline font-semibold text-floodlight-navy text-sm">
                        All Caught Up!
                      </p>
                      <p className="font-body text-xs text-text-muted mt-1 max-w-[220px] mx-auto">
                        {filterTab === 'unread'
                          ? 'No unread notifications at this time.'
                          : 'No operational match alerts or venue notifications.'}
                      </p>
                    </div>
                  ) : (
                    displayedNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={(e) => handleNotificationClick(notif, e)}
                        className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                          !notif.read
                            ? 'bg-pitch-turf-surface/20 hover:bg-pitch-turf-surface/40'
                            : 'hover:bg-state-hover-gray'
                        }`}
                      >
                        {/* Icon Badge */}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${getNotificationIconBg(
                            notif.type
                          )}`}
                        >
                          {getNotificationIcon(notif.type)}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-headline font-bold text-xs text-floodlight-navy truncate group-hover:text-primary transition-colors">
                              {notif.title}
                            </span>
                            <span className="font-badge-label text-[10px] text-text-muted whitespace-nowrap">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-1">
                            <span className="font-badge-label text-[10px] font-semibold text-primary uppercase tracking-wider">
                              {notif.type}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {!notif.read && (
                                <span
                                  className="w-2 h-2 rounded-full bg-live-orange"
                                  title="Unread alert"
                                ></span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notif.id);
                                }}
                                title="Dismiss notification"
                                className="p-1 rounded text-text-muted hover:text-card-red-danger hover:bg-surface-card transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer View All Link */}
                <div className="p-2.5 bg-canvas-alabaster border-t border-border-grid text-center">
                  <a
                    href="#/tournaments/ongoing"
                    onClick={(e) => {
                      setShowNotifications(false);
                      handleNav('/tournaments/ongoing', e);
                    }}
                    className="font-button text-xs font-semibold text-primary hover:text-pitch-turf-hover transition-colors inline-flex items-center gap-1"
                  >
                    <span>View All Active Tournaments & Operations</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Toggle */}
          <div className="relative border-l border-border-grid pl-space-xs" ref={profileRef}>
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
                      <span>{t('nav.organizerDesk')}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-card-red-danger hover:bg-card-red-surface"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.signOut')}</span>
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
                  {t('nav.signIn')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
