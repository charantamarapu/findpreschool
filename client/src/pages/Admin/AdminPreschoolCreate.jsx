import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/apiService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const AdminPreschoolCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    website: '',
    established_year: '',
  });
  const [admissionData, setAdmissionData] = useState({
    monthly_fee: '',
    annual_fee: '',
    verified_rating: '',
  });
  const [imageData, setImageData] = useState({
    image_url: '',
    is_primary: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAdmissionChange = e => {
    const { name, value } = e.target;
    setAdmissionData(d => ({
      ...d,
      [name]: value
    }));
  };

  const handleImageChange = e => {
    const { name, value, type, checked } = e.target;
    setImageData(d => ({
      ...d,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // First, parse numeric values
      const preschoolPayload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        established_year: form.established_year ? parseInt(form.established_year) : null,
      };

      // Create preschool
      const preschoolRes = await adminService.createPreschool(preschoolPayload);
      const preschoolId = preschoolRes.data.id;

      // Create admission details if provided
      if (admissionData.monthly_fee || admissionData.annual_fee || admissionData.verified_rating) {
        const admissionPayload = {
          preschool_id: preschoolId,
          monthly_fee: admissionData.monthly_fee ? parseFloat(admissionData.monthly_fee) : null,
          annual_fee: admissionData.annual_fee ? parseFloat(admissionData.annual_fee) : null,
          verified_rating: admissionData.verified_rating ? parseFloat(admissionData.verified_rating) : null,
        };
        // You'll need to create an endpoint or handle this in the createPreschool
      }

      // Create image if provided
      if (imageData.image_url) {
        const imagePayload = {
          preschool_id: preschoolId,
          image_url: imageData.image_url,
          is_primary: imageData.is_primary,
        };
        // You'll need to create an endpoint or handle this in the createPreschool
      }

      toast.success('Preschool created successfully');
      navigate('/admin/preschools');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/admin/preschools')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Preschools
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add Preschool</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto py-6">
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input name="state" value={form.state} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" rows="3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input name="website" value={form.website} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input name="latitude" type="number" step="0.00000001" value={form.latitude} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 28.7041" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input name="longitude" type="number" step="0.00000001" value={form.longitude} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 77.1025" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                <input name="established_year" type="number" min="1900" max={new Date().getFullYear()} value={form.established_year} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 2010" />
              </div>
            </div>
          </div>

          {/* Admission Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Fee (₹)</label>
                <input name="monthly_fee" type="number" step="0.01" value={admissionData.monthly_fee} onChange={handleAdmissionChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 15000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Fee (₹)</label>
                <input name="annual_fee" type="number" step="0.01" value={admissionData.annual_fee} onChange={handleAdmissionChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 180000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                <input name="verified_rating" type="number" step="0.1" min="0" max="5" value={admissionData.verified_rating} onChange={handleAdmissionChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 4.5" />
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input name="image_url" type="url" value={imageData.image_url} onChange={handleImageChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="flex items-center">
                <input name="is_primary" type="checkbox" checked={imageData.is_primary} onChange={handleImageChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label className="ml-2 text-sm font-medium text-gray-700">Set as Primary Image</label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {submitting ? 'Creating...' : 'Create Preschool'}
            </button>
            <button type="button" onClick={() => navigate('/admin/preschools')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPreschoolCreate;
