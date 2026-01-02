import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/apiService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const AdminReviewEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    parent_name: '',
    rating: 1,
    comment: '',
    verified: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await adminService.getReviews({ limit: 100 });
        const reviews = res.data.reviews || [];
        const review = reviews.find(r => r.id === Number(id));
        if (review) {
          setForm({
            parent_name: review.parent_name || '',
            rating: review.rating || 1,
            comment: review.review_text || '',
            verified: review.verified || false,
          });
        } else {
          toast.error('Review not found');
        }
      } catch (err) {
        toast.error('Failed to fetch review');
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : (name === 'rating' ? Number(value) : value)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.updateReview(id, {
        parent_name: form.parent_name,
        rating: form.rating,
        review_text: form.comment,
        verified: form.verified,
      });
      toast.success('Review updated successfully');
      navigate('/admin/reviews');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/admin/reviews')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Reviews
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Review</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto py-6">
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
              <input name="parent_name" value={form.parent_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
              <input type="number" name="rating" min="1" max="5" value={form.rating} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea name="comment" value={form.comment} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" rows="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <input type="checkbox" name="verified" checked={form.verified} onChange={handleChange} className="mr-2" />
                Verified
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {submitting ? 'Updating...' : 'Update Review'}
            </button>
            <button type="button" onClick={() => navigate('/admin/reviews')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminReviewEdit;
