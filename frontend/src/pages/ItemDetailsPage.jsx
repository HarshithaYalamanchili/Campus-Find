import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { itemAPI, matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Tag,
  Eye,
  CheckCircle2,
  Share2,
  Trash2,
  Sparkles,
  Phone,
  MessageSquare,
  Mail,
  Gift,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import MatchScoreBadge from '../components/MatchScoreBadge';
import MatchComparisonModal from '../components/MatchComparisonModal';
import ContactPosterModal from '../components/ContactPosterModal';
import { BACKEND_URL } from '../services/api';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [comparisonModalMatch, setComparisonModalMatch] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchItemAndMatches = async () => {
      setLoading(true);
      setError('');
      try {
        const itemRes = await itemAPI.getItemById(id);
        if (itemRes.data?.item) {
          setItem(itemRes.data.item);

          // Fetch matches for this item
          try {
            const matchRes = await matchAPI.getItemMatches(id);
            if (matchRes.data?.matches) {
              setMatches(matchRes.data.matches);
            }
          } catch (mErr) {
            console.warn('Could not fetch matches:', mErr.message);
          }
        }
      } catch (err) {
        setError('Item not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndMatches();
  }, [id]);

  const isOwner =
    isAuthenticated &&
    user &&
    item &&
    (item.postedBy?._id === user._id || item.postedBy === user._id || user.role === 'admin');

  const handleToggleStatus = async () => {
    setActionLoading(true);
    try {
      const newStatus = item.status === 'resolved' ? 'active' : 'resolved';
      const res = await itemAPI.markResolved(item._id, { status: newStatus });
      if (res.data?.item) {
        setItem(res.data.item);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await itemAPI.deleteItem(item._id);
      navigate(item.type === 'lost' ? '/lost' : '/found');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Post Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Unable to display item details.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CampusFind Home
        </Link>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';

  const images = item.images && item.images.length > 0 ? item.images : [
    { url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80' }
  ];

  const currentImage = images[selectedImageIndex]?.url?.startsWith('http')
    ? images[selectedImageIndex].url
    : `${BACKEND_URL}${images[selectedImageIndex]?.url}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-slate-900">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={isLost ? '/lost' : '/found'} className="hover:text-slate-900">
          {isLost ? 'Lost Items' : 'Found Items'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{item.title}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <img
              src={currentImage}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Status Pills */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase shadow-sm ${
                  isLost ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                }`}
              >
                {item.type}
              </span>
              {isResolved && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Resolved
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => {
                const thumbUrl = img.url.startsWith('http')
                  ? img.url
                  : `${BACKEND_URL}${img.url}`;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-indigo-600 ring-2 ring-indigo-200'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Poster Management Controls (If Owner) */}
          {isOwner && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block">
                Manage Your Post
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleToggleStatus}
                  disabled={actionLoading}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isResolved
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isResolved ? 'Re-open Post' : 'Mark as Resolved / Returned'}
                </button>
                <button
                  onClick={handleDelete}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Item Information & Contact Box (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 inline-flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {item.category}
              </span>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {item.viewsCount || 1} views
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                  title="Share post"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {item.title}
            </h1>

            {item.reward && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                <Gift className="w-4 h-4 text-amber-600" />
                Reward Offered: {item.reward}
              </div>
            )}
          </div>

          {/* Quick Details Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 block">Campus Location</span>
                <span className="text-slate-600">{item.location}</span>
                {item.specificLocation && (
                  <span className="text-slate-400 block text-[11px] mt-0.5">
                    ({item.specificLocation})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 block">
                  Date {isLost ? 'Lost' : 'Found'}
                </span>
                <span className="text-slate-600">
                  {item.date ? format(new Date(item.date), 'EEEE, MMMM d, yyyy') : 'Recently'}
                </span>
              </div>
            </div>

            {item.brand && (
              <div className="text-slate-600">
                <span className="font-semibold text-slate-700">Brand: </span>
                {item.brand}
              </div>
            )}

            {item.color && (
              <div className="text-slate-600">
                <span className="font-semibold text-slate-700">Color: </span>
                {item.color}
              </div>
            )}
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description & Details
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-200/80">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Poster Profile & Contact CTA */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/60 to-slate-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <img
                src={item.postedBy?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=campus'}
                alt={item.postedBy?.name || 'Poster'}
                className="w-12 h-12 rounded-full border border-indigo-200 bg-white"
              />
              <div>
                <p className="text-xs text-slate-400 font-medium">Reported by</p>
                <p className="text-sm font-bold text-slate-900">
                  {item.postedBy?.name || 'Campus Student'}
                </p>
                <p className="text-xs text-slate-500">
                  {item.postedBy?.department || 'University Member'}
                </p>
              </div>
            </div>

            {!isOwner && (
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all hover:scale-105 shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Poster / Claim
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Standout Feature: Intelligent Multi-Factor Matching Suggestions */}
      <section className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Potential AI Matches ({matches.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Cross-referenced with active {isLost ? 'found' : 'lost'} posts on campus by category, location, keywords, and date.
            </p>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      match.item.type === 'lost'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {match.item.type}
                  </span>
                  <MatchScoreBadge score={match.matchScore} />
                </div>

                <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-200">
                  <img
                    src={
                      match.item.images && match.item.images.length > 0
                        ? match.item.images[0].url.startsWith('http')
                          ? match.item.images[0].url
                          : `${BACKEND_URL}${match.item.images[0].url}`
                        : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={match.item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {match.item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {match.item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setComparisonModalMatch(match)}
                    className="flex-1 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Compare Match
                  </button>
                  <Link
                    to={`/item/${match.item._id}`}
                    className="py-1.5 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              No strong matches detected yet
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our algorithm checks every new post submitted to the platform. You'll be alerted on your dashboard whenever a similar {isLost ? 'found' : 'lost'} item appears.
            </p>
          </div>
        )}
      </section>

      {/* Comparison Modal */}
      {comparisonModalMatch && (
        <MatchComparisonModal
          isOpen={!!comparisonModalMatch}
          onClose={() => setComparisonModalMatch(null)}
          currentItem={item}
          matchedItem={comparisonModalMatch.item}
          matchScore={comparisonModalMatch.matchScore}
          breakdown={comparisonModalMatch.breakdown}
        />
      )}

      {/* Contact Poster Modal */}
      {contactModalOpen && (
        <ContactPosterModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          item={item}
        />
      )}
    </div>
  );
};

export default ItemDetailsPage;
