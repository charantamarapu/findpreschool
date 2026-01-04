import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { preschoolService } from '../services/apiService';
import { PreschoolCard } from '../components/PreschoolCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { MapComponent } from '../components/MapComponent';
import { FilterContext } from '../context/FilterContext';
import { Loader, MapPin, Grid3X3, List, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';

export const PreschoolListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filters, nearbyMode, userLocation, searchRadius } = useContext(FilterContext);
  const [preschools, setPreschools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0 });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const city = searchParams.get('city') || filters.city;

  // Reset offset when city, filters, or nearby mode changes
  useEffect(() => {
    setPagination((p) => ({ ...p, offset: 0 }));
  }, [city, filters, nearbyMode, userLocation, searchRadius]);

  useEffect(() => {
    const fetchPreschools = async () => {
      setLoading(true);
      try {
        let response;

        if (nearbyMode && userLocation) {
          // Use nearby API when location is available
          const params = {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            radius: searchRadius,
            limit: pagination.limit,
            offset: pagination.offset,
          };
          response = await preschoolService.getNearbyPreschools(params);
        } else {
          // Use regular API
          const params = {
            limit: pagination.limit,
            offset: pagination.offset,
          };

          if (city) params.city = city;
          if (filters.minFee) params.minFee = filters.minFee;
          if (filters.maxFee) params.maxFee = filters.maxFee;
          if (filters.minRating) params.minRating = filters.minRating;
          if (filters.minEstablishedYear) params.minEstablishedYear = filters.minEstablishedYear;

          response = await preschoolService.getAllPreschools(params);
        }

        if (response.data.success) {
          setPreschools(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error('Error fetching preschools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreschools();
  }, [city, filters, pagination.offset, nearbyMode, userLocation, searchRadius]);

  const handleViewDetails = (preschoolId) => {
    navigate(`/preschool/${preschoolId}`);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading preschools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            {nearbyMode && userLocation ? (
              <>
                <div className="flex items-center gap-2 text-sm text-cyan-600 mb-2">
                  <Navigation size={14} />
                  <span>Within {searchRadius} km of your location</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Nearby Preschools
                </h1>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin size={14} />
                  <span>{city || 'All India'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {city ? `Preschools in ${city}` : 'All Preschools'}
                </h1>
              </>
            )}
            <p className="text-gray-600 mt-2">
              Found <span className="font-semibold text-primary-600">{pagination.total}</span> preschools.
              {nearbyMode ? ' Sorted by distance.' : ' Compare fees, facilities, and verified reviews.'}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'grid'
                ? 'bg-white shadow-sm text-primary-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Grid3X3 size={18} />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'list'
                ? 'bg-white shadow-sm text-primary-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <List size={18} />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {preschools.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100" style={{ height: '400px' }}>
            <MapComponent
              preschools={preschools}
              center={
                nearbyMode && userLocation
                  ? [userLocation.latitude, userLocation.longitude]
                  : preschools.length > 0
                    ? [preschools[0].latitude || 20.5937, preschools[0].longitude || 78.9629]
                    : [20.5937, 78.9629]
              }
              zoom={nearbyMode ? 12 : 10}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar />
        </div>

        {/* Preschool Grid */}
        <div className="lg:col-span-3">
          {preschools.length > 0 ? (
            <>
              <div className={`grid gap-6 mb-8 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1'
                }`}>
                {preschools.map((preschool, index) => (
                  <div
                    key={preschool.id}
                    className="fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PreschoolCard
                      preschool={preschool}
                      onViewDetails={handleViewDetails}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-t border-gray-100">
                  <button
                    disabled={pagination.offset === 0}
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        offset: Math.max(0, p.offset - p.limit),
                      }))
                    }
                    className="btn-outline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                      <span className="font-semibold text-gray-900">{totalPages}</span>
                    </span>
                  </div>

                  <button
                    disabled={pagination.offset + pagination.limit >= pagination.total}
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        offset: p.offset + p.limit,
                      }))
                    }
                    className="btn-outline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No preschools found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters or search in a different city.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
