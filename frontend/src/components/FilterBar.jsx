import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Electronics',
  'Identity & Cards',
  'Keys',
  'Books & Stationery',
  'Bags & Wallets',
  'Clothing & Footwear',
  'Accessories & Jewelry',
  'Sports & Fitness',
  'Bottles & Flasks',
  'Other',
];

export const LOCATIONS = [
  'All',
  'Central Library',
  'Main Cafeteria & Food Court',
  'Engineering Block (Block A)',
  'Science & Tech Block (Block B)',
  'Business & Arts Wing (Block C)',
  'Student Activity Center (SAC)',
  'Main Auditorium',
  'Sports Complex & Gym',
  'Hostel Zone (North/South)',
  'Campus Shuttle / Bus Bay',
  'Computer Labs & Server Hub',
  'Administrative Block',
  'Other Campus Area',
];

const FilterBar = ({
  search,
  setSearch,
  category,
  setCategory,
  location,
  setLocation,
  status,
  setStatus,
  sort,
  setSort,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search Row */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by keyword, item name, brand, color, or description..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Campus Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'All' ? 'All Locations' : loc}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved Only</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Sort Order
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="date_lost_desc">Event Date (Recent first)</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Reset button if any filter is active */}
      {(search || category !== 'All' || location !== 'All' || status !== 'All' || sort !== 'newest') && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
