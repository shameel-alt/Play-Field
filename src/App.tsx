import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TournamentProvider } from './context/TournamentContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { Step1DetailsPage } from './pages/wizard/Step1DetailsPage';
import { Step2TeamsPage } from './pages/wizard/Step2TeamsPage';
import { Step3ConfirmPage } from './pages/wizard/Step3ConfirmPage';
import { Step4PaymentPage } from './pages/wizard/Step4PaymentPage';
import { OngoingTournamentsPage } from './pages/OngoingTournamentsPage';
import { TournamentManagementPage } from './pages/TournamentManagementPage';
import { EndedTournamentsPage } from './pages/EndedTournamentsPage';
import { PublicLiveTournamentPage } from './pages/PublicLiveTournamentPage';
import { InviteAcceptPage } from './pages/InviteAcceptPage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  // Shared wizard draft state across Steps 1-4
  const [wizardDraft, setWizardDraft] = useState<any>({
    title: 'Colombo Corporate Futsal Super Cup 2026',
    sport: 'futsal',
    tournamentStyle: 'GROUP_KNOCKOUT',
    venueId: 'venue-colombo-futsal-hub',
    selectedCourtNumbers: [1, 2, 5],
    startDate: '2026-11-15',
    endDate: '2026-11-16',
    startTime: '08:00',
    endTime: '20:00',
    daysCount: 2,
    pricingType: 'day',
    totalCost: 140000
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentPath(hash || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Route dispatcher
  const renderRoute = () => {
    // 1. Landing Page
    if (currentPath === '/' || currentPath === '') {
      return <LandingPage onNavigate={navigate} />;
    }

    // 2. Auth Pages
    if (currentPath.startsWith('/login')) {
      return <LoginPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/signup')) {
      return <SignUpPage onNavigate={navigate} />;
    }

    // 3. Onboarding
    if (currentPath === '/onboarding') {
      return <OnboardingPage onNavigate={navigate} />;
    }

    // 4. Dashboard
    if (currentPath === '/dashboard') {
      return <DashboardPage onNavigate={navigate} />;
    }

    // 5. Wizard Steps
    if (currentPath === '/tournaments/new/details') {
      return <Step1DetailsPage onNavigate={navigate} draftData={wizardDraft} setDraftData={setWizardDraft} />;
    }
    if (currentPath === '/tournaments/new/teams') {
      return <Step2TeamsPage onNavigate={navigate} draftData={wizardDraft} setDraftData={setWizardDraft} />;
    }
    if (currentPath === '/tournaments/new/confirm') {
      return <Step3ConfirmPage onNavigate={navigate} draftData={wizardDraft} />;
    }
    if (currentPath === '/tournaments/new/payment') {
      return <Step4PaymentPage onNavigate={navigate} draftData={wizardDraft} />;
    }

    // 6. Ongoing Tournaments List
    if (currentPath === '/tournaments/ongoing') {
      return <OngoingTournamentsPage onNavigate={navigate} />;
    }

    // 7. Live Tournament Management Console (/tournaments/:id/manage)
    if (currentPath.startsWith('/tournaments/') && currentPath.endsWith('/manage')) {
      const parts = currentPath.split('/');
      const tournamentId = parts[2];
      return <TournamentManagementPage tournamentId={tournamentId} onNavigate={navigate} />;
    }

    // 8. Ended Tournaments List & Summary
    if (currentPath === '/tournaments/ended') {
      return <EndedTournamentsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/tournaments/') && currentPath.endsWith('/summary')) {
      const parts = currentPath.split('/');
      const tournamentId = parts[2];
      return <EndedTournamentsPage onNavigate={navigate} selectedTournamentId={tournamentId} />;
    }

    // 9. Public Live Tournament Center (/public/tournament/:id)
    if (currentPath.startsWith('/public/tournament/')) {
      const tournamentId = currentPath.replace('/public/tournament/', '');
      return <PublicLiveTournamentPage tournamentId={tournamentId} />;
    }

    // 10. Direct Co-Organizer Invite Acceptance (/invite/:token)
    if (currentPath.startsWith('/invite/')) {
      const token = currentPath.replace('/invite/', '');
      return <InviteAcceptPage token={token} onNavigate={navigate} />;
    }

    // Fallback to Landing
    return <LandingPage onNavigate={navigate} />;
  };

  return (
    <AuthProvider>
      <TournamentProvider>
        <div className="flex flex-col min-h-screen">
          <Header currentPath={currentPath} onNavigate={navigate} />
          <main className="flex-1 pt-16">
            {renderRoute()}
          </main>
          <Footer onNavigate={navigate} />
        </div>
      </TournamentProvider>
    </AuthProvider>
  );
}

export default App;
