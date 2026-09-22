import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowUpDown,
  X,
  ChefHat,
  Leaf,
} from 'lucide-react';
import { useRestaurants } from '../hooks/useRestaurants';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { CUISINES_LIST } from '../config/constants';
import { useLocationStore } from '../lib/locationStore';

export const HomePage: React.FC = () => {
  const { selectedArea } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'costForTwo'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  // Query restaurants from API
  const { data, isLoading, isError, error } = useRestaurants({
    search: searchQuery,
    cuisine: selectedCuisine === 'All' ? undefined : selectedCuisine,
    veg: vegOnly,
    area: selectedArea || undefined,
    sort: sortBy,
    order: sortOrder,
    page,
    limit: 30,
  });

  const restaurants = data?.items || [];
  const totalCount = data?.total || 0;

  const handleSortChange = (newSort: 'rating' | 'deliveryTime' | 'costForTwo') => {
    if (sortBy === newSort) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSort);
      setSortOrder(newSort === 'deliveryTime' ? 'asc' : 'desc');
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('All');
    setVegOnly(false);
    setSortBy('rating');
    setSortOrder('desc');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCuisine !== 'All' ||
    vegOnly ||
    selectedArea !== null;

  return (
    <div className="min-h-screen min-w-0 w-full bg-slate-50/50">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-b from-orange-50/80 via-white to-slate-50/50 border-b border-orange-100/50 pt-8 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 text-primary text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chennai&apos;s Hyper-Local Food &amp; Dine-In Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Crave it. <span className="text-primary">We&apos;ll drop it.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Order signature Chettinad feasts, hot filter coffee, wood-fired biryanis, and coastal catches
              across 11 Chennai neighborhoods, or reserve your table in seconds.
            </p>

            {/* Search Input Bar */}
            <div className="pt-2">
              <div className="relative flex items-center max-w-xl shadow-lg shadow-orange-500/5 rounded-2xl bg-white border border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
                <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for restaurants, biryani, dosas, parottas, desserts..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-3.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-3 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Cuisine Filter Carousel / Chips */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Explore Cuisines
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-primary hover:text-primary-dark font-semibold flex items-center gap-1"
              >
                <span>Reset all filters</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedCuisine('All');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shadow-xs ${
                selectedCuisine === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Cuisines
            </button>

            {CUISINES_LIST.map((cuisine) => (
              <button
                key={cuisine}
                type="button"
                onClick={() => {
                  setSelectedCuisine(cuisine);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shadow-xs ${
                  selectedCuisine === cuisine
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {!selectedArea && (
          <div className="flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-semibold text-orange-900">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Detect your area in the navbar for more relevant restaurant results.</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Area Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{selectedArea || 'All Chennai Areas'}</span>
            </div>

            {/* Veg Only Toggle */}
            <button
              type="button"
              onClick={() => {
                setVegOnly(!vegOnly);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                vegOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
              <span>Pure Veg Only</span>
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline uppercase tracking-wider">
              Sort by:
            </span>

            <button
              type="button"
              onClick={() => handleSortChange('rating')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                sortBy === 'rating'
                  ? 'bg-orange-50 text-primary border-primary/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Rating</span>
              {sortBy === 'rating' && <ArrowUpDown className="w-3 h-3 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleSortChange('deliveryTime')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                sortBy === 'deliveryTime'
                  ? 'bg-orange-50 text-primary border-primary/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Fastest Delivery</span>
              {sortBy === 'deliveryTime' && <ArrowUpDown className="w-3 h-3 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleSortChange('costForTwo')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                sortBy === 'costForTwo'
                  ? 'bg-orange-50 text-primary border-primary/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Cost</span>
              {sortBy === 'costForTwo' && <ArrowUpDown className="w-3 h-3 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            Showing <strong className="text-slate-800">{restaurants.length}</strong> of{' '}
            <strong className="text-slate-800">{totalCount}</strong> kitchens in{' '}
            {selectedArea || 'Chennai'}
          </span>
        </div>

        {/* Restaurants Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs animate-pulse space-y-3"
              >
                <div className="aspect-16/10 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-rose-100 p-8">
            <p className="text-sm font-bold text-rose-600">Failed to load restaurants</p>
            <p className="text-xs text-slate-500 mt-1">{(error as any)?.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
            <div className="w-16 h-16 bg-orange-50 text-primary rounded-2xl flex items-center justify-center mx-auto">
              <ChefHat className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No restaurants match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any kitchens matching your current search or area. Try resetting
              filters or searching for a different dish.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-2 px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-xs transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
