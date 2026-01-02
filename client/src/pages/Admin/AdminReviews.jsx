import { useNavigate } from 'react-router-dom';
import AdminTable from '../../components/AdminTable';
import { ArrowLeft, Shield } from 'lucide-react';

const AdminReviews = () => {
  const navigate = useNavigate();
  const columns = [
    {
      key: 'preschool',
      label: 'Preschool',
      render: (item) => item.preschool?.name || 'Unknown'
    },
    {
      key: 'parent_name',
      label: 'Parent',
      render: (item) => item.parent_name || 'Anonymous'
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (item) => (
        <div className="flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="ml-1">{item.rating}/5</span>
        </div>
      )
    },
    {
      key: 'verified',
      label: 'Status',
      render: (item) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          item.verified
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.verified ? 'Verified' : 'Pending'}
        </span>
      )
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (item) => (
        <div className="max-w-xs truncate" title={item.comment}>
          {item.comment}
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
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
                Preschools
              </button>
              <button
                onClick={() => navigate('/admin/reviews')}
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
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
          title="Reviews"
          endpoint="reviews"
          columns={columns}
          createPath="/admin/reviews/create"
          editPath="/admin/reviews"
          canCreate={false}
          canEdit={true}
          canDelete={true}
          canVerify={true}
        />
      </div>
    </div>
  );
};

export default AdminReviews;