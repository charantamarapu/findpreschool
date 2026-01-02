import React, { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import { ChevronDown } from 'lucide-react';

export const FilterSidebar = () => {
  const { filters, updateFilter, clearFilters } = useContext(FilterContext);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
      <h3 className="font-bold text-lg mb-4">Filters</h3>

      {/* City Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          City
        </label>
        <select
          value={filters.city}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">All Cities</option>
          {citySuggestions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Fee Range */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Monthly Fee Range
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min Fee"
            value={filters.minFee || ''}
            onChange={(e) =>
              updateFilter('minFee', e.target.value ? parseInt(e.target.value) : null)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
          <input
            type="number"
            placeholder="Max Fee"
            value={filters.maxFee || ''}
            onChange={(e) =>
              updateFilter('maxFee', e.target.value ? parseInt(e.target.value) : null)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Minimum Rating
        </label>
        <select
          value={filters.minRating || ''}
          onChange={(e) =>
            updateFilter('minRating', e.target.value ? parseFloat(e.target.value) : null)
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="">Any Rating</option>
          <option value="4">4.0+ ⭐</option>
          <option value="3.5">3.5+ ⭐</option>
          <option value="3">3.0+ ⭐</option>
        </select>
      </div>

      {/* Advanced Filters */}
      <div className="border-t pt-4 mt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-primary-600"
        >
          Advanced Filters
          <ChevronDown
            size={18}
            className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          />
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {/* Age Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age Group
              </label>
              <div className="space-y-2">
                {['Toddlers (0-2)', 'Preschool (2-3)', 'Pre-K (3-4)', 'Kindergarten (4-5)'].map(
                  (age) => (
                    <label key={age} className="flex items-center gap-2">
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
                        className="rounded"
                      />
                      <span className="text-sm">{age}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facilities
              </label>
              <div className="space-y-2">
                {['Swimming Pool', 'Library', 'Sports', 'Art Studio', 'Outdoor Play'].map(
                  (facility) => (
                    <label key={facility} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.facilities.includes(facility)}
                        onChange={(e) => {
                          updateFilter(
                            'facilities',
                            e.target.checked
                              ? [...filters.facilities, facility]
                              : filters.facilities.filter((f) => f !== facility)
                          );
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full mt-4 btn-outline text-sm"
      >
        Clear All Filters
      </button>
    </div>
  );
};
