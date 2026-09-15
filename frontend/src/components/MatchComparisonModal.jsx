import React from 'react';
import { X, Sparkles, MapPin, Calendar, Tag, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import MatchScoreBadge from './MatchScoreBadge';
import { format } from 'date-fns';
import { BACKEND_URL } from '../services/api';

const MatchComparisonModal = ({ isOpen, onClose, currentItem, matchedItem, matchScore, breakdown }) => {
  if (!isOpen || !matchedItem) return null;

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const getImg = (item) => {
    if (item?.images && item.images.length > 0 && item.images[0].url) {
      return item.images[0].url.startsWith('http')
        ? item.images[0].url
        : `${BACKEND_URL}${item.images[0].url}`;
    }
    return 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Match Score */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Smart Match Comparison
            </h2>
          </div>
          <div>
            <MatchScoreBadge score={matchScore} />
          </div>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/80">
          {/* Current Item */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  currentItem.type === 'lost'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {currentItem.type === 'lost' ? 'Lost Post' : 'Found Post'}
              </span>
              <span className="text-xs text-slate-400 font-medium">This Item</span>
            </div>

            <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={getImg(currentItem)}
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-sm">{currentItem.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {currentItem.description}
              </p>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>{currentItem.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span className="truncate">{currentItem.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{formatDate(currentItem.date)}</span>
              </div>
            </div>
          </div>

          {/* Matched Candidate Item */}
          <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs space-y-3 relative">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  matchedItem.type === 'lost'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {matchedItem.type === 'lost' ? 'Lost Post' : 'Found Post'}
              </span>
              <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Matched Candidate
              </span>
            </div>

            <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={getImg(matchedItem)}
                alt={matchedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-sm">{matchedItem.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {matchedItem.description}
              </p>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>{matchedItem.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span className="truncate">{matchedItem.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{formatDate(matchedItem.date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown details table */}
        {breakdown && (
          <div className="mt-5 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
            <h5 className="font-semibold text-indigo-900 mb-2">
              Algorithm Score Breakdown
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
              <div className="bg-white p-2 rounded-lg border border-indigo-100">
                <span className="text-slate-500 block text-[10px]">Category (35%)</span>
                <span className="font-bold text-slate-900">{breakdown.categoryScore} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-indigo-100">
                <span className="text-slate-500 block text-[10px]">Keywords (30%)</span>
                <span className="font-bold text-slate-900">{breakdown.keywordScore} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-indigo-100">
                <span className="text-slate-500 block text-[10px]">Location (20%)</span>
                <span className="font-bold text-slate-900">{breakdown.locationScore} pts</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-indigo-100">
                <span className="text-slate-500 block text-[10px]">Date (15%)</span>
                <span className="font-bold text-slate-900">{breakdown.dateScore} pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
          <Link
            to={`/item/${matchedItem._id}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
          >
            View Matched Item Details
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchComparisonModal;
