import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { itemAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';
import { PlusCircle, AlertCircle, HelpCircle } from 'lucide-react';

const LostItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state if URL query params change
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) setSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const fetchLostItems = async () => {
      setLoading(true);
      try {
        const params = {
          type: 'lost',
          search: search.trim() || undefined,
          category: category !== 'All' ? category : undefined,
          location: location !== 'All' ? location : undefined,
          status: status !== 'All' ? status : undefined,
          sort,
          page,
          limit: 12,
        };

        const res = await itemAPI.getItems(params);
        if (res.data) {
          setItems(res.data.items || []);
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching lost items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, [search, category, location, status, sort, page]);

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setStatus('All');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>● Lost Items Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Lost on Campus
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through items reported missing across campus halls, labs, and student centers.
          </p>
        </div>

        <Link
          to="/post?type=lost"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:shadow"
        >
          <PlusCircle className="w-4 h-4" />
          Report a Lost Item
        </Link>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        setCategory={(val) => {
          setCategory(val);
          setPage(1);
        }}
        location={location}
        setLocation={(val) => {
          setLocation(val);
          setPage(1);
        }}
        status={status}
        setStatus={(val) => {
          setStatus(val);
          setPage(1);
        }}
        sort={sort}
        setSort={(val) => {
          setSort(val);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {/* Items Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-500">
          <span>Showing {items.length} of {total} lost items</span>
          {page > 1 && <span>Page {page} of {totalPages}</span>}
        </div>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">
              No matching lost items found
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try adjusting your search keywords or resetting filters. If you lost something recently, report it now to trigger automated matching!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Reset Filters
              </button>
              <Link
                to="/post?type=lost"
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Post Lost Report
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-600 px-3">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostItemsPage;
