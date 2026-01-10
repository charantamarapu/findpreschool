import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/apiService';
import toast from 'react-hot-toast';
import {
  Users,
  School,
  MessageSquare,
  BarChart3,
  LogOut,
  Shield,
  Plus,
  ArrowUpRight,
  Home
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (user) {
      setAdminUser(JSON.parse(user));
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const menuItems = [
    {
      title: 'Preschools',
      icon: School,
      count: stats.preschools,
      path: '/admin/preschools',
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Reviews',
      icon: MessageSquare,
      count: stats.reviews,
      path: '/admin/reviews',
      color: 'from-emerald-500 to-green-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Admins',
      icon: Shield,
      count: stats.admins,
      path: '/admin/admins',
      color: 'from-rose-500 to-red-600',
      bgLight: 'bg-rose-50',
      textColor: 'text-rose-600'
    }
  ];

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', active: true },
    { label: 'Preschools', path: '/admin/preschools' },
    { label: 'Reviews', path: '/admin/reviews' },
    { label: 'Admins', path: '/admin/admins' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-500">FindPreschool.org</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${item.active
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <Home size={16} />
                  View Site
                </Link>

                <div className="h-8 w-px bg-gray-200" />

                <span className="text-sm text-gray-600 hidden sm:block">
                  {adminUser?.name || adminUser?.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {adminUser?.name?.split(' ')[0] || 'Admin'}! 👋
          </h2>
          <p className="text-gray-600">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {menuItems.map((item, index) => (
            <div
              key={item.title}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-gray-100/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <item.icon size={24} className="text-white" />
                </div>
                <ArrowUpRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{item.count || 0}</p>
              <p className="text-gray-500 text-sm font-medium">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">Manage your platform efficiently</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/admin/preschools/create')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl hover:from-blue-100 hover:to-blue-100 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Plus size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Add Preschool</p>
                  <p className="text-sm text-gray-500">Create new listing</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/reviews')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl hover:from-emerald-100 hover:to-emerald-100 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <MessageSquare size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Manage Reviews</p>
                  <p className="text-sm text-gray-500">Moderate submissions</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/admins')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl hover:from-purple-100 hover:to-purple-100 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Users size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Manage Admins</p>
                  <p className="text-sm text-gray-500">User permissions</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;