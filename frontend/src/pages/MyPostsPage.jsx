import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemAPI } from '../services/api';
import {
  FileText,
  PlusCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

const MyPostsPage = () => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, lost, found, active, resolved
  const [loading, setLoading] = useState(true);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await itemAPI.getMyItems();
      if (res.data?.items) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('Error fetching user items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = item.status === 'resolved' ? 'active' : 'resolved';
      await itemAPI.markResolved(item._id, { status: newStatus });
      fetchMyItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
    try {
      await itemAPI.deleteItem(id);
      fetchMyItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  // Filter items according to tab
  const filteredItems = items.filter((item) => {
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'resolved') return item.status === 'resolved';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Campus Posts ({items.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your reports, resolve recovered items, or check matches.
          </p>
        </div>

        <Link
          to="/post"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Post
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'all', label: `All Posts (${items.length})` },
          { key: 'lost', label: `Lost (${items.filter((i) => i.type === 'lost').length})` },
          { key: 'found', label: `Found (${items.filter((i) => i.type === 'found').length})` },
          { key: 'active', label: `Active (${items.filter((i) => i.status === 'active').length})` },
          { key: 'resolved', label: `Resolved (${items.filter((i) => i.status === 'resolved').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isLost = item.type === 'lost';
            const isResolved = item.status === 'resolved';
            const imgUrl =
              item.images && item.images.length > 0 && item.images[0].url
                ? item.images[0].url.startsWith('http')
                  ? item.images[0].url
                  : `http://localhost:5000${item.images[0].url}`
                : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isLost
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.type}
                      </span>
                      {isResolved ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          Resolved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Active
                        </span>
                      )}
                      <span className="text-xs text-slate-400">• {item.category}</span>
                    </div>

                    <Link to={`/item/${item._id}`}>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.date ? format(new Date(item.date), 'MMM d, yyyy') : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Link
                    to={`/item/${item._id}`}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="View item details & matches"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isResolved
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isResolved ? 'Re-open' : 'Mark Resolved'}
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            No posts found in this tab
          </h3>
          <p className="text-xs text-slate-500">
            You haven't posted any items matching this status.
          </p>
          <Link
            to="/post"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            Create Post
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
