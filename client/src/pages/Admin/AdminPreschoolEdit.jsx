import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/apiService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const AdminPreschoolEdit = () => {
  const { id } = useParams();
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
    monthly_fee_min: '',
    monthly_fee_max: '',
    annual_fee_min: '',
    annual_fee_max: '',
    verified_rating: '',
  });
  const [imageData, setImageData] = useState({
    image_url: '',
    is_primary: false,
  });
  const [preschool, setPreschool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPreschool = async () => {
      try {
        const res = await adminService.getPreschools({ limit: 100 });
        const preschools = res.data.preschools || [];
        const foundPreschool = preschools.find(p => p.id === Number(id));
        if (foundPreschool) {
          setPreschool(foundPreschool);
          setForm({
            name: foundPreschool.name || '',
            address: foundPreschool.address || '',
            city: foundPreschool.city || '',
            state: foundPreschool.state || '',
            pincode: foundPreschool.pincode || '',
            latitude: foundPreschool.latitude || '',
            longitude: foundPreschool.longitude || '',
            phone: foundPreschool.phone || '',
            email: foundPreschool.email || '',
            website: foundPreschool.website || '',
            established_year: foundPreschool.established_year || '',
          });
          
          // Load admission data
          if (foundPreschool.admission) {
            setAdmissionData({
              monthly_fee_min: foundPreschool.admission.monthly_fee_min || '',
              monthly_fee_max: foundPreschool.admission.monthly_fee_max || '',
              annual_fee_min: foundPreschool.admission.annual_fee_min || '',
              annual_fee_max: foundPreschool.admission.annual_fee_max || '',
              verified_rating: foundPreschool.admission.verified_rating || '',
            });
          }
          
          // Load image data
          const primaryImage = foundPreschool.images?.find(img => img.is_primary);
          if (primaryImage) {
            setImageData({
              image_url: primaryImage.image_url || '',
              is_primary: true,
            });
          }
        } else {
          toast.error('Preschool not found');
        }
      } catch (err) {
        toast.error('Failed to fetch preschool');
      } finally {
        setLoading(false);
      }
    };
    fetchPreschool();
  }, [id]);

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
      // Parse numeric values
      const preschoolPayload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        established_year: form.established_year ? parseInt(form.established_year) : null,
      };

      // Update preschool
      await adminService.updatePreschool(id, preschoolPayload);

      // Update admission details
      if (admissionData.monthly_fee_min || admissionData.monthly_fee_max || admissionData.annual_fee_min || admissionData.annual_fee_max || admissionData.verified_rating) {
        const admissionPayload = {
          preschool_id: Number(id),
          monthly_fee_min: admissionData.monthly_fee_min ? parseFloat(admissionData.monthly_fee_min) : null,
          monthly_fee_max: admissionData.monthly_fee_max ? parseFloat(admissionData.monthly_fee_max) : null,
          annual_fee_min: admissionData.annual_fee_min ? parseFloat(admissionData.annual_fee_min) : null,
          annual_fee_max: admissionData.annual_fee_max ? parseFloat(admissionData.annual_fee_max) : null,
          verified_rating: admissionData.verified_rating ? parseFloat(admissionData.verified_rating) : 0,
        };
        await adminService.createAdmissionDetail(admissionPayload);
      }

      // Update image if changed
      if (imageData.image_url && preschool?.images?.length > 0) {
        const primaryImage = preschool.images.find(img => img.is_primary);
        if (primaryImage && primaryImage.image_url !== imageData.image_url) {
          await adminService.deletePreschoolImage(primaryImage.id);
          const imagePayload = {
            preschool_id: Number(id),
            image_url: imageData.image_url,
            is_primary: true,
          };
          await adminService.createPreschoolImage(imagePayload);
        }
      } else if (imageData.image_url) {
        const imagePayload = {
          preschool_id: Number(id),
          image_url: imageData.image_url,
          is_primary: true,
        };
        await adminService.createPreschoolImage(imagePayload);
      }

      toast.success('Preschool updated successfully');
      navigate('/admin/preschools');
    } catch (err) {
      console.error('Error updating preschool:', err);
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
          <button onClick={() => navigate('/admin/preschools')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Preschools
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Preschool</h1>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
                <div className="flex gap-2">
                  <input name="google_map_url" type="url" value={form.google_map_url || ''} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.google.com/maps/...?" />
                  <button type="button" onClick={() => {
                    if (form.latitude && form.longitude) {
                      setForm(f => ({ ...f, google_map_url: `https://www.google.com/maps/search/?api=1&query=${f.latitude},${f.longitude}` }));
                    }
                  }} className="inline-flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm">Generate</button>
                </div>
              </div>
            </div>
          </div>

          {/* Admission Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Fee Range (₹)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input name="monthly_fee_min" type="number" step="0.01" value={admissionData.monthly_fee_min} onChange={handleAdmissionChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Min e.g., 10000" />
                  <input name="monthly_fee_max" type="number" step="0.01" value={admissionData.monthly_fee_max} onChange={handleAdmissionChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Max e.g., 20000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Fee Range (₹)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input name="annual_fee_min" type="number" step="0.01" value={admissionData.annual_fee_min} onChange={handleAdmissionChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Min e.g., 120000" />
                  <input name="annual_fee_max" type="number" step="0.01" value={admissionData.annual_fee_max} onChange={handleAdmissionChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Max e.g., 240000" />
                </div>
              </div>
              <div className="max-w-xs">
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
              {submitting ? 'Updating...' : 'Update Preschool'}
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

export default AdminPreschoolEdit;
