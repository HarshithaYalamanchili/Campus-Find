import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemAPI, matchAPI, userAPI } from '../services/api';
import {
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Eye,
  Layers,
} from 'lucide-react';
import ItemCard from '../components/ItemCard';
import MatchScoreBadge from '../components/MatchScoreBadge';
import MatchComparisonModal from '../components/MatchComparisonModal';

const DashboardPage = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [dashboardMatches, setDashboardMatches] = useState([]);
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    totalResolved: 0,
    recoveryRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modal states for comparing items
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itemsRes, matchesRes, profileRes] = await Promise.all([
          itemAPI.getMyItems(),
          matchAPI.getUserDashboardMatches(),
          userAPI.getProfile(),
        ]);

        if (itemsRes.data) {
          setMyItems(itemsRes.data.items || []);
        }

        if (matchesRes.data) {
          setDashboardMatches(matchesRes.data.matches || []);
        }

        if (profileRes.data?.stats) {
          setStats(profileRes.data.stats);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CampusFind Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200">
            {user?.department || 'Student'} • {user?.studentId || user?.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/post"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            Post Lost or Found Item
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lost Reported
            </p>
            <p className="text-2xl font-extrabold text-red-600 mt-1">
              {stats.totalLost || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            !
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Found Reported
            </p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {stats.totalFound || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Items Resolved
            </p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">
              {stats.totalResolved || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recovery Rate
            </p>
            <p className="text-2xl font-extrabold text-violet-600 mt-1">
              {stats.recoveryRate || 0}%
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Standout Feature Widget: Active Match Recommendations */}
      <section className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Active Smart Matches for Your Posts
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Our matching algorithm found possible candidates for items you reported on campus.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 w-fit">
            {dashboardMatches.length} Possible Matches
          </span>
        </div>

        {dashboardMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardMatches.map((match, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 border border-indigo-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Your {match.myPost.type} item:
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {match.myPost.title}
                    </h4>
                  </div>
                  <MatchScoreBadge score={match.matchScore} />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Matching {match.matchedItem.type} Post
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {match.matchedItem.location}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {match.matchedItem.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {match.matchedItem.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedMatch(match)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Compare Side-by-Side
                  </button>
                  <Link
                    to={`/item/${match.matchedItem._id}`}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    View Post
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              No active match alerts right now
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              As more lost and found items are posted across campus, any item scoring above 45% similarity will appear here automatically.
            </p>
          </div>
        )}
      </section>

      {/* User's Recent Posts section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Your Active Posts ({myItems.length})
            </h3>
            <p className="text-xs text-slate-500">
              Manage your reports, edit details, or mark them as resolved.
            </p>
          </div>
          <Link
            to="/my-posts"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Manage All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myItems.slice(0, 4).map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-600">
              You haven't reported any lost or found items yet.
            </p>
            <Link
              to="/post"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Post Your First Item
            </Link>
          </div>
        )}
      </section>

      {/* Comparison Modal */}
      {selectedMatch && (
        <MatchComparisonModal
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          currentItem={selectedMatch.myPost}
          matchedItem={selectedMatch.matchedItem}
          matchScore={selectedMatch.matchScore}
          breakdown={selectedMatch.breakdown}
        />
      )}
    </div>
  );
};

export default DashboardPage;
