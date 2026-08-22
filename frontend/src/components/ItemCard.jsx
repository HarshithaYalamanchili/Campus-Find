import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import MatchScoreBadge from './MatchScoreBadge';

const ItemCard = ({ item, matchScore, matchBreakdown }) => {
  if (!item) return null;

  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';

  const imageUrl =
    item.images && item.images.length > 0 && item.images[0].url
      ? item.images[0].url.startsWith('http')
        ? item.images[0].url
        : `http://localhost:5000${item.images[0].url}`
      : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';

  let formattedDate = 'Recently';
  try {
    if (item.date) {
      formattedDate = formatDistanceToNow(new Date(item.date), { addSuffix: true });
    }
  } catch (e) {
    formattedDate = 'Recently';
  }

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Card Header & Image */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Status & Type Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${
              isLost
                ? 'bg-red-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {item.type}
          </span>
          {isResolved && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Resolved
            </span>
          )}
        </div>

        {/* Match Score Badge (if passed) */}
        {matchScore !== undefined && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-end">
            <MatchScoreBadge score={matchScore} />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 mb-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>{item.category}</span>
            {item.reward && (
              <span className="ml-auto text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-semibold text-[11px] border border-amber-100">
                Reward: {item.reward}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/item/${item._id}`}>
            <h3 className="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>
          </Link>

          {/* Description preview */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formattedDate}</span>
            </div>

            <Link
              to={`/item/${item._id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Details
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
