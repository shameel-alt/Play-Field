import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ScoreStepperProps {
  scoreA: number;
  scoreB: number;
  onScoreAChange: (val: number) => void;
  onScoreBChange: (val: number) => void;
  teamAName: string;
  teamBName: string;
  disabled?: boolean;
}

export const ScoreStepper: React.FC<ScoreStepperProps> = ({
  scoreA,
  scoreB,
  onScoreAChange,
  onScoreBChange,
  teamAName,
  teamBName,
  disabled = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-space-xs py-space-sm select-none">
      <div className="flex items-center justify-center gap-space-md">
        {/* Steppers Team A */}
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            disabled={disabled}
            aria-label={`Increase ${teamAName} Score`}
            onClick={() => onScoreAChange(scoreA + 1)}
            className="score-stepper-btn hover:border-primary active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={disabled || scoreA <= 0}
            aria-label={`Decrease ${teamAName} Score`}
            onClick={() => onScoreAChange(Math.max(0, scoreA - 1))}
            className="score-stepper-btn text-text-muted hover:border-text-muted active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Central Monospaced High-Visibility Scoreboard Deck */}
        <div className="px-space-lg py-space-sm rounded-xl bg-floodlight-navy text-surface-card flex items-center gap-space-md shadow-md border border-floodlight-navy/80">
          <span className="font-mono text-[36px] md:text-[44px] font-extrabold text-primary-fixed tracking-tight tabular-nums min-w-[36px] text-center">
            {scoreA}
          </span>
          <span className="font-mono text-2xl text-text-placeholder opacity-60 font-light">
            –
          </span>
          <span className="font-mono text-[36px] md:text-[44px] font-extrabold text-surface-card tracking-tight tabular-nums min-w-[36px] text-center">
            {scoreB}
          </span>
        </div>

        {/* Steppers Team B */}
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            disabled={disabled}
            aria-label={`Increase ${teamBName} Score`}
            onClick={() => onScoreBChange(scoreB + 1)}
            className="score-stepper-btn hover:border-primary active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={disabled || scoreB <= 0}
            aria-label={`Decrease ${teamBName} Score`}
            onClick={() => onScoreBChange(Math.max(0, scoreB - 1))}
            className="score-stepper-btn text-text-muted hover:border-text-muted active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <span className="font-mono text-xs text-text-muted tracking-tight text-center mt-1">
        Real-Time Broadcast Synchronized
      </span>
    </div>
  );
};
