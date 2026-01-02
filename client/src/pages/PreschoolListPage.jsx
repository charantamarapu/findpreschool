import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { preschoolService } from '../services/apiService';
import { PreschoolCard } from '../components/PreschoolCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { MapComponent } from '../components/MapComponent';
import { FilterContext } from '../context/FilterContext';
import { Loader } from 'lucide-react';

export const PreschoolListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filters } = useContext(FilterContext);
  const [preschools, setPreschools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0 });

  const city = searchParams.get('city') || filters.city;

  useEffect(() => {
    const fetchPreschools = async () => {
      setLoading(true);
      try {
        const params = {
          limit: 20,
          offset: 0,
        };

        if (city) params.city = city;
        if (filters.minFee) params.minFee = filters.minFee;
        if (filters.maxFee) params.maxFee = filters.maxFee;
        if (filters.minRating) params.minRating = filters.minRating;

        const response = await preschoolService.getAllPreschools(params);

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
  }, [city, filters]);

  const handleViewDetails = (preschoolId) => {
    navigate(`/preschool/${preschoolId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size={48} className="animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading preschools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {city ? `Preschools in ${city}` : 'All Preschools'}
        </h1>
        <p className="text-gray-600">
          Found {pagination.total} preschools. Compare fees, facilities, and verified reviews.
        </p>
      </div>

      {/* Map Section */}
      {preschools.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '400px' }}>
            <MapComponent 
              preschools={preschools} 
              center={preschools.length > 0 ? [preschools[0].latitude || 20.5937, preschools[0].longitude || 78.9629] : [20.5937, 78.9629]}
              zoom={10}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {preschools.map((preschool) => (
                  <PreschoolCard
                    key={preschool.id}
                    preschool={preschool}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="flex justify-between items-center py-8 border-t">
                  <button
                    disabled={pagination.offset === 0}
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        offset: Math.max(0, p.offset - p.limit),
                      }))
                    }
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>

                  <span className="text-gray-600">
                    Showing {pagination.offset + 1} to{' '}
                    {Math.min(pagination.offset + pagination.limit, pagination.total)} of{' '}
                    {pagination.total}
                  </span>

                  <button
                    disabled={pagination.offset + pagination.limit >= pagination.total}
                    onClick={() =>
                      setPagination((p) => ({
                        ...p,
                        offset: p.offset + p.limit,
                      }))
                    }
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No preschools found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
