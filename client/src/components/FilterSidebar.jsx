import React, { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import { ChevronDown, SlidersHorizontal, X, Star, Calendar, IndianRupee, MapPin, Navigation, Loader2 } from 'lucide-react';

export const FilterSidebar = () => {
  const {
    filters,
    updateFilter,
    clearFilters,
    nearbyMode,
    userLocation,
    searchRadius,
    setSearchRadius,
    locationError,
    requestLocation,
    disableNearbyMode,
  } = useContext(FilterContext);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);

  const citySuggestions = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Ahmedabad',
  ];

  const radiusOptions = [
    { value: 0.5, label: '500m' },
    { value: 1, label: '1 km' },
    { value: 3, label: '3 km' },
    { value: 5, label: '5 km' },
  ];

  const [showCustomRadius, setShowCustomRadius] = React.useState(false);
  const [customRadiusValue, setCustomRadiusValue] = React.useState('');

  const hasActiveFilters = filters.city || filters.minFee || filters.maxFee ||
    filters.minRating || filters.minEstablishedYear ||
    filters.ageGroup.length > 0 || filters.facilities.length > 0 || nearbyMode;

  const handleRequestLocation = () => {
    setIsLocating(true);
    requestLocation();
    // Reset locating state after a timeout (geolocation callback will update state)
    setTimeout(() => setIsLocating(false), 3000);
  };

  const handleCustomRadiusSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(customRadiusValue);
    if (value && value > 0 && value <= 100) {
      setSearchRadius(value);
      setShowCustomRadius(false);
    }
  };

  const isCustomRadius = !radiusOptions.some(opt => opt.value === searchRadius);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden sticky top-20">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <SlidersHorizontal size={16} className="text-primary-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Search Nearby Section */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Navigation size={14} className="text-cyan-600" />
            Search Nearby
          </label>

          {nearbyMode && userLocation ? (
            <div className="space-y-3">
              {/* Active nearby mode indicator */}
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 rounded-lg px-3 py-2">
                <MapPin size={14} className="text-green-600" />
                <span>Using your location</span>
              </div>

              {/* Radius selector */}
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">Search radius</label>
                <div className="grid grid-cols-5 gap-1">
                  {radiusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setSearchRadius(option.value); setShowCustomRadius(false); }}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${searchRadius === option.value && !showCustomRadius
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom radius option */}
                <div className="mt-2">
                  {showCustomRadius ? (
                    <form onSubmit={handleCustomRadiusSubmit} className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="100"
                        placeholder="km"
                        value={customRadiusValue}
                        onChange={(e) => setCustomRadiusValue(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-cyan-600 text-white text-xs rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomRadius(false)}
                        className="px-2 py-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => { setShowCustomRadius(true); setCustomRadiusValue(isCustomRadius ? String(searchRadius) : ''); }}
                      className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${isCustomRadius
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                      {isCustomRadius ? `Custom: ${searchRadius} km` : 'Custom...'}
                    </button>
                  )}
                </div>
              </div>

              {/* Disable button */}
              <button
                onClick={disableNearbyMode}
                className="w-full py-2 text-xs text-gray-500 hover:text-red-500 border border-dashed border-gray-200 hover:border-red-200 rounded-lg transition-all"
              >
                Disable nearby search
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleRequestLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLocating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Locating...
                  </>
                ) : (
                  <>
                    <MapPin size={16} />
                    Use My Location
                  </>
                )}
              </button>
              {locationError && (
                <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                  {locationError}
                </p>
              )}
              <p className="text-xs text-gray-500 text-center">
                Find preschools near you
              </p>
            </div>
          )}
        </div>

        {/* City Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all bg-gray-50 hover:bg-white"
            disabled={nearbyMode}
          >
            <option value="">All Cities</option>
            {citySuggestions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {nearbyMode && (
            <p className="text-xs text-gray-500 mt-1">City filter disabled in nearby mode</p>
          )}
        </div>

        {/* Fee Range */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <IndianRupee size={12} className="text-primary-500" />
            Monthly Fee Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minFee || ''}
              onChange={(e) =>
                updateFilter('minFee', e.target.value ? parseInt(e.target.value) : null)
              }
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all bg-gray-50 hover:bg-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxFee || ''}
              onChange={(e) =>
                updateFilter('maxFee', e.target.value ? parseInt(e.target.value) : null)
              }
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all bg-gray-50 hover:bg-white"
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Star size={12} className="text-amber-500" fill="currentColor" />
            Minimum Rating
          </label>
          <div className="flex gap-2">
            {[null, 4, 3.5, 3].map((rating) => (
              <button
                key={rating || 'any'}
                onClick={() => updateFilter('minRating', rating)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${filters.minRating === rating
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {rating ? `${rating}+` : 'Any'}
              </button>
            ))}
          </div>
        </div>

        {/* Established Year Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar size={12} className="text-primary-500" />
            Established After
          </label>
          <input
            type="number"
            placeholder="e.g., 2010"
            value={filters.minEstablishedYear || ''}
            onChange={(e) =>
              updateFilter('minEstablishedYear', e.target.value ? parseInt(e.target.value) : null)
            }
            min="1900"
            max={new Date().getFullYear()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all bg-gray-50 hover:bg-white"
          />
        </div>

        {/* Advanced Filters */}
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors py-2"
          >
            <span>Advanced Filters</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-5 animate-slide-down">
              {/* Age Group */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Age Group
                </label>
                <div className="space-y-2">
                  {['Toddlers (0-2)', 'PreSchool (2-3)', 'Pre-K (3-4)', 'Kindergarten (4-5)'].map(
                    (age) => (
                      <label
                        key={age}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${filters.ageGroup.includes(age)
                          ? 'bg-primary-50 border border-primary-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={filters.ageGroup.includes(age)}
                          onChange={(e) => {
                            updateFilter(
                              'ageGroup',
                              e.target.checked
                                ? [...filters.ageGroup, age]
                                : filters.ageGroup.filter((a) => a !== age)
                            );
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{age}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Facilities
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Swimming Pool', 'Library', 'Sports', 'Art Studio', 'Outdoor Play'].map(
                    (facility) => (
                      <button
                        key={facility}
                        onClick={() => {
                          updateFilter(
                            'facilities',
                            filters.facilities.includes(facility)
                              ? filters.facilities.filter((f) => f !== facility)
                              : [...filters.facilities, facility]
                          );
                        }}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${filters.facilities.includes(facility)
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {facility}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={clearFilters}
            className="w-full py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-red-600 border-2 border-dashed border-gray-200 hover:border-red-200 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
