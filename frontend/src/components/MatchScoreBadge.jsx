import React from 'react';
import { Sparkles, CheckCircle, AlertCircle, Info } from 'lucide-react';

const MatchScoreBadge = ({ score, confidence, breakdown, showDetails = false }) => {
  const numScore = typeof score === 'number' ? score : parseInt(score, 10) || 0;

  // Determine color scheme based on score
  let bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
  let dotClass = 'bg-blue-500';
  let badgeLabel = `Possible Match: ${numScore}%`;

  if (numScore >= 80) {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotClass = 'bg-emerald-500';
  } else if (numScore >= 60) {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
    dotClass = 'bg-amber-500';
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs ${bgClass}`}
      >
        <span className={`w-2 h-2 rounded-full animate-pulse ${dotClass}`} />
        <Sparkles className="w-3.5 h-3.5" />
        <span>{badgeLabel}</span>
      </div>

      {showDetails && breakdown && (
        <div className="text-[11px] text-slate-500 space-y-0.5 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex justify-between">
            <span>Category Match:</span>
            <span className="font-medium text-slate-700">{breakdown.categoryScore} / 35 pts</span>
          </div>
          <div className="flex justify-between">
            <span>Keyword Overlap:</span>
            <span className="font-medium text-slate-700">{breakdown.keywordScore} / 30 pts</span>
          </div>
          <div className="flex justify-between">
            <span>Location Match:</span>
            <span className="font-medium text-slate-700">{breakdown.locationScore} / 20 pts</span>
          </div>
          <div className="flex justify-between">
            <span>Date Proximity:</span>
            <span className="font-medium text-slate-700">{breakdown.dateScore} / 15 pts</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScoreBadge;
