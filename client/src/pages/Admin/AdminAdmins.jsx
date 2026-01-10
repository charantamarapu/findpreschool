import { useNavigate } from 'react-router-dom';
import AdminTable from '../../components/AdminTable';
import { ArrowLeft, Shield } from 'lucide-react';

const AdminAdmins = () => {
  const navigate = useNavigate();
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item) => item.name || 'N/A'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'role',
      label: 'Role',
      render: (item) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.role === 'admin'
            ? 'bg-red-100 text-red-800'
            : item.role === 'moderator'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
          {item.role}
        </span>
      )
    },
    {
      key: 'active',
      label: 'Status',
      render: (item) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          }`}>
          {item.active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (item) => new Date(item.created_at).toLocaleDateString()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                Admin Panel
              </h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/preschools')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                PreSchools
              </button>
              <button
                onClick={() => navigate('/admin/reviews')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Reviews
              </button>
              <button
                onClick={() => navigate('/admin/admins')}
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Admins
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6">
        <AdminTable
          title="Admin Users"
          endpoint="admins"
          columns={columns}
          createPath="/admin/admins/create"
          editPath="/admin/admins"
          canCreate={true}
          canEdit={true}
          canDelete={true}
          canVerify={false}
        />
      </div>
    </div>
  );
};

export default AdminAdmins;