import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/apiService';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Star } from 'lucide-react';

const AdminPreSchoolCreate = () => {
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
  // Multiple images support
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
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

  // Add a new image to the list
  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    // Check for duplicates
    if (images.some(img => img.image_url === newImageUrl.trim())) {
      toast.error('This image URL already exists');
      return;
    }
    const newImage = {
      image_url: newImageUrl.trim(),
      is_primary: images.length === 0, // First image is primary by default
    };
    setImages([...images, newImage]);
    setNewImageUrl('');
  };

  // Remove an image from the list
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // If removed image was primary and there are still images, make the first one primary
    if (images[index].is_primary && updatedImages.length > 0) {
      updatedImages[0].is_primary = true;
    }
    setImages(updatedImages);
  };

  // Set an image as primary
  const handleSetPrimary = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    setImages(updatedImages);
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
      const preschoolRes = await adminService.createPreSchool(preschoolPayload);
      const preschoolId = preschoolRes.data.id;

      // Create admission details if provided
      if (admissionData.monthly_fee_min || admissionData.monthly_fee_max || admissionData.annual_fee_min || admissionData.annual_fee_max || admissionData.verified_rating) {
        const admissionPayload = {
          preschool_id: preschoolId,
          monthly_fee_min: admissionData.monthly_fee_min ? parseFloat(admissionData.monthly_fee_min) : null,
          monthly_fee_max: admissionData.monthly_fee_max ? parseFloat(admissionData.monthly_fee_max) : null,
          annual_fee_min: admissionData.annual_fee_min ? parseFloat(admissionData.annual_fee_min) : null,
          annual_fee_max: admissionData.annual_fee_max ? parseFloat(admissionData.annual_fee_max) : null,
          verified_rating: admissionData.verified_rating ? parseFloat(admissionData.verified_rating) : 0,
        };
        await adminService.createAdmissionDetail(admissionPayload);
      }

      // Create all images
      for (const image of images) {
        const imagePayload = {
          preschool_id: preschoolId,
          image_url: image.image_url,
          is_primary: image.is_primary,
        };
        await adminService.createPreSchoolImage(imagePayload);
      }

      toast.success('PreSchool created successfully with all details!');
      navigate('/admin/preschools');
    } catch (err) {
      console.error('Error creating preschool:', err);
      toast.error(err.response?.data?.error || 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/admin/preschools')} className="flex items-center text-gray-500 hover:text-primary-600 transition-colors mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to PreSchools
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New PreSchool</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a new listing</p>
        </div>
      </header>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <form onSubmit={handleSubmit} className="bg-white shadow-card rounded-2xl p-8 space-y-8 border border-gray-100/50">
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

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">PreSchool Images</h3>
            <p className="text-sm text-gray-500 mb-4">Add multiple images. The first image will be set as primary by default. Click the star icon to set a different image as primary.</p>

            {/* Add New Image */}
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter image URL (https://example.com/image.jpg)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>

            {/* Image List */}
            {images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className={`relative border rounded-lg overflow-hidden ${img.is_primary ? 'ring-2 ring-blue-500' : 'border-gray-200'}`}>
                    <img
                      src={img.image_url}
                      alt={`PreSchool image ${index + 1}`}
                      className="w-full h-40 object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className={`p-1.5 rounded-full ${img.is_primary ? 'bg-yellow-400 text-white' : 'bg-white text-gray-600 hover:bg-yellow-100'}`}
                        title={img.is_primary ? 'Primary Image' : 'Set as Primary'}
                      >
                        <Star className={`h-4 w-4 ${img.is_primary ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                        title="Remove Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {img.is_primary && (
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-1">
                        Primary Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No images added yet. Add images using the input above.</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {submitting ? 'Creating...' : 'Create PreSchool'}
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

export default AdminPreSchoolCreate;
