import { useState } from "react";
import { ChevronDown, X, Filter } from "lucide-react";

// ServiceFilters Component with Enhanced Design
const ServiceFilters = ({
  search,
  setSearch,
  price,
  setPrice,
  duration,
  setDuration,
  sort,
  setSort,
  availableOnly,
  setAvailableOnly,
  onClear,
  onApply,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const handleClear = () => {
    onClear();
    setShowMobileFilters(false);
  };

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (search) count++;
    if (price) count++;
    if (duration) count++;
    if (availableOnly) count++;
    setActiveFilters(count);
  };

  // Handle any filter change
  const handleFilterChange = (setter, value) => {
    setter(value);
    countActiveFilters();
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow-sm p-6 mb-8">
      {/* Header with Mobile Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Find Your Service</h2>
          <p className="text-sm text-gray-600 mt-1">Filter and sort services</p>
        </div>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-pink-500 transition"
        >
          <Filter size={18} />
          Filters{" "}
          {activeFilters > 0 && (
            <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by service name..."
          value={search}
          onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition text-sm"
        />
      </div>

      {/* Filters Container */}
      <div className={`${showMobileFilters ? "block" : "hidden"} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Price Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price Range
            </label>
            <select
              value={price}
              onChange={(e) => handleFilterChange(setPrice, e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            >
              <option value="">All Prices</option>
              <option value="low">Below ₹500</option>
              <option value="mid">₹500 – ₹1000</option>
              <option value="high">Above ₹1000</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => handleFilterChange(setDuration, e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            >
              <option value="">All Durations</option>
              <option value="30">Up to 30 mins</option>
              <option value="60">Up to 60 mins</option>
              <option value="90">90+ mins</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => handleFilterChange(setSort, e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="duration">Duration (Short to Long)</option>
            </select>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-end">
            <label className="flex items-center gap-3 p-2.5 border border-gray-300 rounded-lg hover:bg-white transition cursor-pointer w-full">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) =>
                  handleFilterChange(setAvailableOnly, e.target.checked)
                }
                className="w-5 h-5 rounded cursor-pointer accent-pink-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Available Only
              </span>
            </label>
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <button
              onClick={handleClear}
              className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition font-medium text-sm flex items-center justify-center gap-2"
            >
              <X size={16} />
              Clear All
            </button>
          </div>
        </div>

        {/* Mobile Filter Close Button */}
        <button
          onClick={() => setShowMobileFilters(false)}
          className="md:hidden w-full mt-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ServiceFilters;
