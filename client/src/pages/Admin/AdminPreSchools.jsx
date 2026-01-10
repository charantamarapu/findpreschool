import { useNavigate } from 'react-router-dom';
import AdminTable from '../../components/AdminTable';
import { ArrowLeft, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const AdminPreSchools = () => {
  const navigate = useNavigate();
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-gray-500">{item.city}</div>
        </div>
      )
    },
    {
      key: 'verified_status',
      label: 'Status',
      render: (item) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.verified_status
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
          }`}>
          {item.verified_status ? 'Verified' : 'Pending'}
        </span>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (item) => item.admissionDetails?.[0]?.rating || 'N/A'
    },
    {
      key: 'monthly_fee',
      label: 'Monthly Fee',
      render: (item) => {
        const min = item.admissionDetails?.[0]?.monthly_fee_min;
        const max = item.admissionDetails?.[0]?.monthly_fee_max;
        if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
        if (min) return `${formatCurrency(min)}`;
        if (max) return `${formatCurrency(max)}`;
        return 'N/A';
      }
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
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
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
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admins
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6">
        <AdminTable
          title="PreSchools"
          endpoint="preschools"
          columns={columns}
          createPath="/admin/preschools/new"
          editPath="/admin/preschools"
          canCreate={true}
          canEdit={true}
          canDelete={true}
          canVerify={true}
        />
      </div>
    </div>
  );
};

export default AdminPreSchools;