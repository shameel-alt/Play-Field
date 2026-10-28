import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { useAuth } from '../../context/AuthContext';
import { Tournament } from '../../types/tournament';
import { CheckCircle2, Copy, Check, ExternalLink, ShieldCheck, CreditCard, QrCode, Building, Lock, ArrowRight } from 'lucide-react';

interface Step4PaymentPageProps {
  onNavigate: (path: string) => void;
  draftData: any;
}

export const Step4PaymentPage: React.FC<Step4PaymentPageProps> = ({ onNavigate, draftData }) => {
  const { createTournament } = useTournament();
  const { currentUser } = useAuth();

  const [paymentTerm, setPaymentTerm] = useState<'advance' | 'full'>('advance');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CARD' | 'QR_WALLET'>('BANK_TRANSFER');
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publishedTournamentId, setPublishedTournamentId] = useState<string>('');

  const totalCost = draftData?.totalCost || 140000;
  const advanceAmount = Math.round(totalCost * 0.3);
  const payableAmount = paymentTerm === 'advance' ? advanceAmount : totalCost;

  const handlePayAndPublish = async () => {
    setIsProcessing(true);

    const generatedId = `tournament-${Date.now()}`;
    const generatedSlug = (draftData?.title || 'colombo-cup-2026')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newTournament: Tournament = {
      id: generatedId,
      slug: generatedSlug,
      title: draftData?.title || 'Colombo Corporate Futsal Super Cup 2026',
      sport: draftData?.sport || 'futsal',
      tournamentStyle: draftData?.tournamentStyle || 'GROUP_KNOCKOUT',
      status: 'PUBLISHED_ONGOING',
      venueId: draftData?.venueId || 'venue-colombo-futsal-hub',
      venue: draftData?.venue,
      selectedCourtNumbers: draftData?.selectedCourtNumbers || [1, 2, 5],
      startDate: draftData?.startDate || '2026-11-15',
      endDate: draftData?.endDate || '2026-11-16',
      startTime: draftData?.startTime || '08:00',
      endTime: draftData?.endTime || '20:00',
      daysCount: draftData?.daysCount || 2,
      createdBy: currentUser?.id || 'user-demo-organizer',
      coOrganizers: [
        {
          id: currentUser?.id || 'user-demo-organizer',
          email: currentUser?.email || 'shameel.organizer@playfield.lk',
          name: currentUser?.fullName || 'Muhammed Shameel',
          role: 'LEAD'
        }
      ],
      advancePaymentStatus: paymentTerm === 'advance' ? 'PARTIAL_30' : 'FULL',
      advancePaymentAmount: payableAmount,
      totalCost,
      paymentMethod,
      paymentReference: `#LK-PF-2026-${Date.now().toString().slice(-4)}`,
      teams: draftData?.teams || [],
      matches: (draftData?.matches || []).map((m: any) => ({
        ...m,
        tournamentId: generatedId
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await createTournament(newTournament);
    setPublishedTournamentId(generatedId);
    setIsProcessing(false);
    setIsPaid(true);
  };

  const publicUrl = `${window.location.origin}/#/public/tournament/${publishedTournamentId || 'colombo-premier-futsal-2026'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Wizard Stepper Bar */}
      <section className="w-full bg-surface-card border-b border-border-grid py-space-md shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-status-success-emerald">
              <CheckCircle2 className="w-5 h-5 text-status-success-emerald" />
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold tracking-wider">Step 01 • Passed</span>
                <span className="font-subheading text-xs truncate font-semibold text-on-surface">Event & Venue</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-status-success-emerald">
              <CheckCircle2 className="w-5 h-5 text-status-success-emerald" />
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold tracking-wider">Step 02 • Passed</span>
                <span className="font-subheading text-xs truncate font-semibold text-on-surface">Teams & Rosters</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-status-success-emerald">
              <CheckCircle2 className="w-5 h-5 text-status-success-emerald" />
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold tracking-wider">Step 03 • Passed</span>
                <span className="font-subheading text-xs truncate font-semibold text-on-surface">Structure Confirmation</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-pitch-turf-surface text-primary border border-primary-container/20">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-mono text-xs font-bold">4</div>
              <div className="flex flex-col min-w-0">
                <span className="font-eyebrow text-[10px] uppercase font-bold text-primary tracking-wider">Final Step • Active</span>
                <span className="font-subheading text-xs truncate font-bold text-pitch-turf-active">Payment & Publication</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Work Desk */}
      <div className="max-w-[1440px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-xl w-full">
        {!isPaid ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
            {/* Left Column: Payment & Deposit Terms (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              {/* Fee Breakdown Card */}
              <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between pb-2 border-b border-border-grid">
                  <h2 className="font-headline font-bold text-lg text-floodlight-navy">
                    Court Reservation & Fee Breakdown
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-xs text-text-muted uppercase">
                    Pro-Forma Quotation #PF-2026-LK
                  </span>
                </div>

                <div className="space-y-2 text-xs font-body">
                  <div className="p-3 bg-canvas-alabaster rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-floodlight-navy block">
                        {draftData?.venue?.name || 'Colombo Futsal Hub'}
                      </span>
                      <span className="text-text-muted text-[11px]">
                        Courts {draftData?.selectedCourtNumbers?.join(', ') || '1, 2, 5'} • {draftData?.daysCount || 2} Tournament Days
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-floodlight-navy">
                      LKR {totalCost.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-pitch-turf-surface rounded-xl flex items-center justify-between text-pitch-turf-active">
                    <div>
                      <span className="font-bold block">
                        Play Field Live Broadcast Desk License
                      </span>
                      <span className="text-[11px] opacity-80">
                        Zero latency public feed, score steppers & instant link
                      </span>
                    </div>
                    <span className="font-mono font-bold text-status-success-emerald uppercase">
                      COMPLIMENTARY (FREE)
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-border-grid flex items-baseline justify-between">
                  <span className="font-eyebrow text-xs uppercase text-text-muted">Total Venue Quota:</span>
                  <span className="font-mono text-2xl font-extrabold text-floodlight-navy">
                    LKR {totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Selective Terms (30% vs 100%) */}
              <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
                <h3 className="font-headline font-bold text-base text-floodlight-navy">
                  Select Settlement Terms
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <button
                    type="button"
                    onClick={() => setPaymentTerm('advance')}
                    className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
                      paymentTerm === 'advance'
                        ? 'bg-pitch-turf-surface border-primary-container ring-1 ring-primary-container shadow-xs'
                        : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-mono text-[10px] uppercase font-bold">
                          Recommended
                        </span>
                        {paymentTerm === 'advance' && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <span className="font-subheading font-bold text-floodlight-navy text-sm block">
                        30% Advance Deposit
                      </span>
                      <span className="font-mono text-xl font-bold text-primary-container block mt-1">
                        LKR {advanceAmount.toLocaleString()}
                      </span>
                      <p className="font-body text-xs text-text-muted mt-1 leading-relaxed">
                        Immediately locks Courts {draftData?.selectedCourtNumbers?.join(', ') || '1, 2, 5'}. Balance settles on tournament check-in desk.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTerm('full')}
                    className={`p-space-md rounded-xl text-left border flex flex-col justify-between transition-all ${
                      paymentTerm === 'full'
                        ? 'bg-pitch-turf-surface border-primary-container ring-1 ring-primary-container shadow-xs'
                        : 'bg-canvas-alabaster border-border-grid hover:bg-state-hover-gray'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[10px] uppercase font-bold">
                          Full Settlement
                        </span>
                        {paymentTerm === 'full' && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <span className="font-subheading font-bold text-floodlight-navy text-sm block">
                        100% Full Venue Package
                      </span>
                      <span className="font-mono text-xl font-bold text-floodlight-navy block mt-1">
                        LKR {totalCost.toLocaleString()}
                      </span>
                      <p className="font-body text-xs text-text-muted mt-1 leading-relaxed">
                        Complete upfront payment. Fast-track pitch access with zero matchday administration.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
                <h3 className="font-headline font-bold text-base text-floodlight-navy">
                  Select Payment Method
                </h3>

                <div className="grid grid-cols-3 gap-space-sm">
                  {[
                    { id: 'BANK_TRANSFER', label: 'CEFT Transfer', icon: Building },
                    { id: 'QR_WALLET', label: 'LankaQR / Wallet', icon: QrCode },
                    { id: 'CARD', label: 'Credit / Debit', icon: CreditCard }
                  ].map(m => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-floodlight-navy text-surface-card border-floodlight-navy shadow-xs'
                            : 'bg-canvas-alabaster text-on-surface border-border-grid hover:bg-state-hover-gray'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-subheading text-xs font-semibold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Bank Details Banner */}
                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="p-space-md rounded-xl bg-canvas-alabaster border border-border-grid flex flex-col gap-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Bank Account:</span>
                      <span className="font-bold text-floodlight-navy">Play Field Operations PVT LTD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Commercial Bank:</span>
                      <span>Torrington Branch (A/C: 1000 8920 4410 02)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Mandatory Reference:</span>
                      <span className="font-bold text-primary">#LK-PF-2026-940</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Checkout Final Action (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg">
              <div className="bg-surface-card rounded-2xl border border-border-grid p-space-lg shadow-sm flex flex-col gap-space-md">
                <h3 className="font-headline font-bold text-base text-floodlight-navy pb-2 border-b border-border-grid">
                  Final Publication Review
                </h3>

                <div className="p-space-md rounded-xl bg-pitch-turf-surface border border-status-success-emerald/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-status-success-emerald" />
                    <span className="font-headline font-bold text-sm text-pitch-turf-active">
                      Target Payable Now
                    </span>
                  </div>
                  <span className="font-mono text-xl font-extrabold text-pitch-turf-active">
                    LKR {payableAmount.toLocaleString()}
                  </span>
                </div>

                <p className="font-body text-xs text-text-muted leading-relaxed">
                  Clicking below locks Courts {draftData?.selectedCourtNumbers?.join(', ') || '1, 2, 5'}, transitions tournament status to <strong>PUBLISHED_ONGOING</strong>, and generates your instant public broadcast URL.
                </p>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayAndPublish}
                  className="btn-primary w-full py-3.5 text-base font-bold shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Lock...' : `Lock Courts & Publish Tournament (LKR ${payableAmount.toLocaleString()})`}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen on Payment Confirmation */
          <div className="max-w-2xl mx-auto bg-surface-card rounded-2xl border border-border-grid p-space-xl shadow-xl flex flex-col items-center text-center gap-space-lg animate-fade">
            <div className="w-16 h-16 rounded-2xl bg-pitch-turf-surface text-status-success-emerald flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-pitch-turf-surface text-status-success-emerald font-mono text-xs font-bold uppercase tracking-wider">
                Tournament Published & Active
              </span>
              <h2 className="font-headline font-extrabold text-2xl text-floodlight-navy mt-2">
                Courts Locked! Live Broadcast Link Generated
              </h2>
              <p className="font-body text-sm text-text-muted mt-1 max-w-md mx-auto">
                Your tournament is officially staged at Colombo Futsal Hub. Anyone with the public link can view live scores, courts, and standings without logging in.
              </p>
            </div>

            {/* Unique Shareable Public URL Box */}
            <div className="w-full p-space-md rounded-xl bg-canvas-alabaster border border-border-grid flex flex-col gap-2 text-left">
              <span className="font-eyebrow text-xs uppercase text-text-muted font-bold">
                Unique Shareable Public URL:
              </span>
              <div className="flex items-center justify-between gap-2 bg-surface-card p-2 rounded-lg border border-border-grid">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="bg-transparent font-mono text-xs text-primary font-bold truncate w-full focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn-secondary text-xs py-1 px-3 flex items-center gap-1 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-status-success-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-space-md w-full pt-space-xs">
              <button
                type="button"
                onClick={() => onNavigate(`/tournaments/${publishedTournamentId}/manage`)}
                className="btn-primary w-full py-3 text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Launch Live Management Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/dashboard')}
                className="btn-secondary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
