import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';
import { itemAPI, userAPI } from '../services/api';
import ItemCard from '../components/ItemCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('lost');
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 48,
    resolvedItems: 38,
    recoveryRate: 85,
    totalUsers: 140,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, statsRes] = await Promise.all([
          itemAPI.getRecentItems(),
          userAPI.getCampusStats(),
        ]);

        if (recentRes.data) {
          setRecentLost(recentRes.data.recentLost || []);
          setRecentFound(recentRes.data.recentFound || []);
        }

        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }
      } catch (err) {
        console.error('Error loading landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const targetRoute = searchType === 'lost' ? '/lost' : '/found';
    navigate(`${targetRoute}?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Smart AI Matching for Campus Lost & Found</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Reuniting Campus with Lost Valuables{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Instantly.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Lost an item or discovered something unattended? CampusFind pairs students, faculty, and campus security with an automated multi-factor matching engine.
            </p>

            {/* Interactive Hero Search Box */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-slate-200/80">
                {/* Search Type Tabs */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-3 w-fit mx-auto sm:mx-0">
                  <button
                    type="button"
                    onClick={() => setSearchType('lost')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      searchType === 'lost'
                        ? 'bg-red-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Search Lost Items
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('found')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      searchType === 'found'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Search Found Items
                  </button>
                </div>

                {/* Form Input */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="E.g., AirPods Pro, Dell charger, Student ID, Wallet..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Popular Search Quick Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                <span>Popular:</span>
                {['AirPods', 'Water Bottle', 'Student ID', 'Scientific Calculator', 'Keys'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSearchQuery(item);
                      navigate(`/${searchType}?search=${encodeURIComponent(item)}`);
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/post"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                Post an Item Now
              </Link>
              <Link
                to="/lost"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-200 shadow-xs transition-all hover:border-slate-300"
              >
                Browse All Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
              {stats.totalItems || 48}+
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Items Reported
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
              {stats.resolvedItems || 38}+
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Items Returned
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
              {stats.recoveryRate || 85}%
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Recovery Success Rate
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-violet-600">
              {stats.totalUsers || 140}+
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Campus Members
            </p>
          </div>
        </div>
      </section>

      {/* Standout Feature Callout: Matching Algorithm */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Standout Innovation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Automated Multi-Factor Matching Algorithm
              </h2>
              <p className="text-indigo-200 text-sm leading-relaxed">
                CampusFind eliminates manual scrolling. When you report a lost item, our algorithm automatically cross-evaluates all active found posts using category, keyword token similarity, campus location zone, and date proximity to produce a 0–100% match score!
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="font-bold text-indigo-300 block">Category (35%)</span>
                  <span className="text-indigo-100">Exact & hierarchical taxonomy</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="font-bold text-indigo-300 block">Keywords (30%)</span>
                  <span className="text-indigo-100">Brand, color & title tokens</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="font-bold text-indigo-300 block">Location (20%)</span>
                  <span className="text-indigo-100">Campus buildings & desks</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="font-bold text-indigo-300 block">Date (15%)</span>
                  <span className="text-indigo-100">Time window proximity</span>
                </div>
              </div>
            </div>

            {/* Live Algorithm Demo Card Visual */}
            <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Algorithm in Action
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Possible Match: 88%
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-100">
                  <span className="font-bold text-red-700 block">Lost Post:</span>
                  <span className="text-slate-700 font-medium">
                    Apple AirPods Pro 2 in white case (Library Desk #14)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="font-bold text-emerald-700 block">Found Post:</span>
                  <span className="text-slate-700 font-medium">
                    Found White Apple AirPods Case (Central Library 2nd Floor)
                  </span>
                </div>
              </div>
              <div className="text-center pt-2">
                <Link
                  to="/post"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  Test With Your Own Item
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How CampusFind Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            A simple 3-step workflow designed for college students and staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Post Your Item
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload photos, select your campus location, date, and description. Specify your contact preference (WhatsApp, Phone, or in-app message).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Instant AI Match Detection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our matching engine continuously compares lost items with found items and highlights match confidence percentages on your dashboard.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Connect & Resolve
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify proof of ownership, meet safely on campus, return the valuable, and mark the post as resolved.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Lost Items Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Recently Reported Lost
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Have you seen any of these items around campus?
            </p>
          </div>
          <Link
            to="/lost"
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            View All Lost Items
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLost.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentLost.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
            No lost items reported yet.
          </div>
        )}
      </section>

      {/* Recent Found Items Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Recently Found on Campus
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Claim items found in libraries, cafeterias, and labs.
            </p>
          </div>
          <Link
            to="/found"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View All Found Items
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentFound.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentFound.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
            No found items posted yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
