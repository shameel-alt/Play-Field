import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, ShieldCheck, ArrowRight, Activity, Calendar, Trophy, Share2 } from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (path: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [selectedSport, setSelectedSport] = useState<string>('futsal');
  const [selectedRole, setSelectedRole] = useState<string>('director');

  const handleFinish = () => {
    onNavigate('/dashboard');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl flex flex-col gap-space-xl">
      {/* Editorial Header */}
      <div className="bg-surface-card p-space-lg rounded-2xl border border-border-grid shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Welcome, {currentUser?.fullName || 'Tournament Director'}</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-floodlight-navy">
            Organizer System Setup & Discipline Configuration
          </h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Tailor your default pitchside layout, sport rule presets, and scoring desk privileges.
          </p>
        </div>
      </div>

      {/* Section 1: Primary Sport Preset */}
      <div className="bg-surface-card p-space-lg rounded-2xl border border-border-grid shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-border-grid pb-2">
          <h2 className="font-headline font-bold text-lg text-floodlight-navy">
            1. Select Primary Sport Discipline
          </h2>
          <span className="font-mono text-xs text-text-muted uppercase">Rule Configuration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Futsal 5v5 (Default Selected) */}
          <button
            type="button"
            onClick={() => setSelectedSport('futsal')}
            className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
              selectedSport === 'futsal'
                ? 'bg-pitch-turf-surface border-primary-container shadow-sm ring-1 ring-primary-container'
                : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="w-10 h-10 rounded-lg bg-surface-card text-primary font-bold flex items-center justify-center shadow-xs">
                ⚽
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedSport === 'futsal'
                    ? 'bg-primary-container text-on-primary'
                    : 'border border-border-control text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <span className="font-subheading font-bold text-floodlight-navy block">
                Futsal (5v5 Pro Turf)
              </span>
              <span className="font-body text-xs text-on-surface-variant mt-1 block">
                Fast-paced hard turf format with stop-clock rules & FIFA tiebreakers.
              </span>
              <span className="mt-2 inline-block px-2 py-0.5 rounded bg-surface-card text-status-success-emerald font-mono text-[10px] font-bold uppercase">
                FIFA / AMF Configured
              </span>
            </div>
          </button>

          {/* 7-a-side */}
          <button
            type="button"
            onClick={() => setSelectedSport('football7')}
            className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
              selectedSport === 'football7'
                ? 'bg-pitch-turf-surface border-primary-container shadow-sm ring-1 ring-primary-container'
                : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="w-10 h-10 rounded-lg bg-surface-card text-floodlight-navy font-bold flex items-center justify-center shadow-xs">
                🏟️
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedSport === 'football7'
                    ? 'bg-primary-container text-on-primary'
                    : 'border border-border-control text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <span className="font-subheading font-bold text-floodlight-navy block">
                7-a-side Football
              </span>
              <span className="font-body text-xs text-on-surface-variant mt-1 block">
                Mid-pitch outdoor or enclosed dome competition setups.
              </span>
              <span className="mt-2 inline-block px-2 py-0.5 rounded bg-surface-card text-text-muted font-mono text-[10px] uppercase font-bold">
                Turf & Natural Grass
              </span>
            </div>
          </button>

          {/* Indoor Cricket */}
          <button
            type="button"
            onClick={() => setSelectedSport('cricket')}
            className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
              selectedSport === 'cricket'
                ? 'bg-pitch-turf-surface border-primary-container shadow-sm ring-1 ring-primary-container'
                : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="w-10 h-10 rounded-lg bg-surface-card text-floodlight-navy font-bold flex items-center justify-center shadow-xs">
                🏏
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedSport === 'cricket'
                    ? 'bg-primary-container text-on-primary'
                    : 'border border-border-control text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <span className="font-subheading font-bold text-floodlight-navy block">
                Indoor Cricket
              </span>
              <span className="font-body text-xs text-on-surface-variant mt-1 block">
                Net arenas with customized over quotas and skin scoring.
              </span>
              <span className="mt-2 inline-block px-2 py-0.5 rounded bg-surface-card text-text-muted font-mono text-[10px] uppercase font-bold">
                Tension Net Arena
              </span>
            </div>
          </button>

          {/* Badminton */}
          <button
            type="button"
            onClick={() => setSelectedSport('badminton')}
            className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
              selectedSport === 'badminton'
                ? 'bg-pitch-turf-surface border-primary-container shadow-sm ring-1 ring-primary-container'
                : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="w-10 h-10 rounded-lg bg-surface-card text-floodlight-navy font-bold flex items-center justify-center shadow-xs">
                🏸
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedSport === 'badminton'
                    ? 'bg-primary-container text-on-primary'
                    : 'border border-border-control text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <span className="font-subheading font-bold text-floodlight-navy block">
                Badminton
              </span>
              <span className="font-body text-xs text-on-surface-variant mt-1 block">
                Singles & doubles knockouts on synthetic courts.
              </span>
              <span className="mt-2 inline-block px-2 py-0.5 rounded bg-surface-card text-text-muted font-mono text-[10px] uppercase font-bold">
                BWF Taraflex
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Section 2: Default Operational Role */}
      <div className="bg-surface-card p-space-lg rounded-2xl border border-border-grid shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-border-grid pb-2">
          <h2 className="font-headline font-bold text-lg text-floodlight-navy">
            2. Your Default Operational Authority
          </h2>
          <span className="font-mono text-xs text-text-muted uppercase">Desk Permissions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <button
            type="button"
            onClick={() => setSelectedRole('director')}
            className={`p-space-lg rounded-xl text-left border flex flex-col gap-2 transition-all ${
              selectedRole === 'director'
                ? 'bg-pitch-turf-surface border-primary-container ring-1 ring-primary-container shadow-sm'
                : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-mono text-[10px] uppercase font-bold">
                Superadmin
              </span>
              {selectedRole === 'director' && <Check className="w-4 h-4 text-primary" />}
            </div>
            <span className="font-subheading font-bold text-floodlight-navy text-base">
              Lead Tournament Director
            </span>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Full administrative authority to book venues, allocate courts, invite co-organizers, issue walkovers/DQs, and publish official public URLs.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('scorer')}
            className={`p-space-lg rounded-xl text-left border flex flex-col gap-2 transition-all ${
              selectedRole === 'scorer'
                ? 'bg-pitch-turf-surface border-primary-container ring-1 ring-primary-container shadow-sm'
                : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-secondary text-surface-card font-mono text-[10px] uppercase font-bold">
                Sideline Official
              </span>
              {selectedRole === 'scorer' && <Check className="w-4 h-4 text-primary" />}
            </div>
            <span className="font-subheading font-bold text-floodlight-navy text-base">
              Pitchside Scorer & Timekeeper
            </span>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Streamlined matchday terminal focused on instant score incrementing, player goal logging, assists, card cautions, and clock controls.
            </p>
          </button>
        </div>
      </div>

      {/* Section 3: 3-Step System Workflow Brief */}
      <div className="bg-floodlight-navy text-surface-card p-space-lg rounded-2xl shadow-md flex flex-col gap-space-md">
        <span className="font-eyebrow text-xs text-primary-fixed uppercase tracking-wider">
          Play Field 3-Step Operations Workflow
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md text-xs">
          <div className="p-3 bg-surface-card/10 rounded-xl flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary-fixed text-floodlight-navy font-mono font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <strong className="text-surface-card block font-headline">Reserve Multi-Court Slots</strong>
              <span className="text-text-placeholder">Pick venue, select Court 1–5, and lock schedule blocks with advance deposit.</span>
            </div>
          </div>
          <div className="p-3 bg-surface-card/10 rounded-xl flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary-fixed text-floodlight-navy font-mono font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <strong className="text-surface-card block font-headline">Register Squads & Auto-Draw</strong>
              <span className="text-text-placeholder">Add teams and player rosters. Algorithmic Berger engine generates conflict-free fixtures.</span>
            </div>
          </div>
          <div className="p-3 bg-surface-card/10 rounded-xl flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary-fixed text-floodlight-navy font-mono font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <strong className="text-surface-card block font-headline">Sideline Live Operations</strong>
              <span className="text-text-placeholder">Log goals, court relocations, and walkovers with instant public broadcast sync.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Action Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleFinish}
          className="btn-primary py-3.5 px-8 text-base shadow-md flex items-center gap-2"
        >
          <span>Launch Organizer Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
