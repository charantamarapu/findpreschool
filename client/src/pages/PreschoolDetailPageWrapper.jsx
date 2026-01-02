import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { preschoolService } from '../services/apiService';
import { PreschoolDetailPage } from '../components/PreschoolDetail';
import { Loader } from 'lucide-react';

export const PreschoolDetailPageWrapper = () => {
  const { id } = useParams();
  const [preschool, setPreschool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreschool = async () => {
      try {
        setLoading(true);
        const response = await preschoolService.getPreschoolById(id);

        if (response.data.success) {
          setPreschool(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching preschool:', err);
        setError('Failed to load preschool details');
      } finally {
        setLoading(false);
      }
    };

    fetchPreschool();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size={48} className="animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading preschool details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <a href="/preschools" className="btn-primary mt-4">
            Back to List
          </a>
        </div>
      </div>
    );
  }

  return <PreschoolDetailPage preschool={preschool} />;
};
