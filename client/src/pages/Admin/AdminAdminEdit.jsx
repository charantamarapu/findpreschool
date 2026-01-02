import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/apiService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const AdminAdminEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'moderator',
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await adminService.getAdmins();
        const admins = Array.isArray(res.data) ? res.data : res.data.admins || [];
        const admin = admins.find(a => a.id === Number(id));
        if (admin) {
          setForm({
            name: admin.name || '',
            email: admin.email || '',
            role: admin.role || 'moderator',
            active: admin.active !== undefined ? admin.active : true,
          });
        } else {
          toast.error('Admin user not found');
        }
      } catch (err) {
        toast.error('Failed to fetch admin user');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.updateAdmin(id, form);
      toast.success('Admin user updated successfully');
      navigate('/admin/admins');
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
          <button onClick={() => navigate('/admin/admins')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Admin Users
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Admin User</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto py-6">
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="mr-2" />
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {submitting ? 'Updating...' : 'Update Admin User'}
            </button>
            <button type="button" onClick={() => navigate('/admin/admins')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAdminEdit;
