import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/user';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, fullName: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  pendingInvite: { token: string; tournamentId: string } | null;
  setPendingInvite: (invite: { token: string; tournamentId: string } | null) => void;
  clearPendingInvite: () => void;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'user-demo-organizer',
  email: 'shameel.organizer@playfield.lk',
  fullName: 'Muhammed Shameel',
  role: 'director',
  preferredSports: ['futsal', 'cricket'],
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('playfield_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_DEMO_USER;
  });

  const [pendingInvite, setPendingInviteState] = useState<{ token: string; tournamentId: string } | null>(() => {
    const saved = sessionStorage.getItem('playfield_pending_invite');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  // Check URL parameters for invitation links on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get('inviteToken');
    const tournamentId = params.get('tournamentId');

    if (inviteToken && tournamentId) {
      const invite = { token: inviteToken, tournamentId };
      setPendingInviteState(invite);
      sessionStorage.setItem('playfield_pending_invite', JSON.stringify(invite));
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    const user: UserProfile = {
      id: `user-${email.replace(/[^a-zA-Z0-9]/g, '-')}`,
      email,
      fullName: email.split('@')[0].replace(/\./g, ' ').toUpperCase(),
      role: 'organizer',
      preferredSports: ['futsal'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };

    setCurrentUser(user);
    localStorage.setItem('playfield_user', JSON.stringify(user));
    return true;
  };

  const signup = async (email: string, fullName: string, role: UserRole = 'organizer'): Promise<boolean> => {
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role,
      preferredSports: ['futsal'],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    };

    setCurrentUser(user);
    localStorage.setItem('playfield_user', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('playfield_user');
  };

  const setPendingInvite = (invite: { token: string; tournamentId: string } | null) => {
    setPendingInviteState(invite);
    if (invite) {
      sessionStorage.setItem('playfield_pending_invite', JSON.stringify(invite));
    } else {
      sessionStorage.removeItem('playfield_pending_invite');
    }
  };

  const clearPendingInvite = () => {
    setPendingInviteState(null);
    sessionStorage.removeItem('playfield_pending_invite');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        pendingInvite,
        setPendingInvite,
        clearPendingInvite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
