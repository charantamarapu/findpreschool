import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/apiService';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminTable = ({
  title,
  endpoint,
  columns,
  createPath,
  editPath,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  canVerify = false
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    try {
      let response;
      switch (endpoint) {
        case 'preschools':
          response = await adminService.getPreschools({ page, limit: 10 });
          break;
        case 'reviews':
          response = await adminService.getReviews({ page, limit: 10 });
          break;
        case 'admins':
          response = await adminService.getAdmins();
          break;
        default:
          throw new Error('Unknown endpoint');
      }

      setData(response.data[endpoint] || response.data.rows || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error(`Failed to fetch ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${title.slice(0, -1).toLowerCase()}?`)) {
      return;
    }

    try {
      switch (endpoint) {
        case 'preschools':
          await adminService.deletePreschool(id);
          break;
        case 'reviews':
          await adminService.deleteReview(id);
          break;
        case 'admins':
          await adminService.deleteAdmin(id);
          break;
        default:
          throw new Error('Unknown endpoint');
      }
      toast.success(`${title.slice(0, -1)} deleted successfully`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to delete ${title.toLowerCase().slice(0, -1)}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} ${title.toLowerCase()}?`)) {
      return;
    }

    try {
      await adminService.bulkDelete(endpoint, selectedItems);
      toast.success(`${selectedItems.length} ${title.toLowerCase()} deleted successfully`);
      setSelectedItems([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete items');
    }
  };

  const handleVerify = async (id, currentStatus) => {
    try {
      switch (endpoint) {
        case 'preschools':
          await adminService.updatePreschool(id, { verified_status: !currentStatus });
          break;
        case 'reviews':
          await adminService.updateReview(id, { verified: !currentStatus });
          break;
        default:
          throw new Error('Unknown endpoint');
      }
      toast.success(`${title.slice(0, -1)} ${!currentStatus ? 'verified' : 'unverified'} successfully`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${!currentStatus ? 'verify' : 'unverify'} ${title.toLowerCase().slice(0, -1)}`);
    }
  };

  const handleBulkVerify = async () => {
    if (selectedItems.length === 0) return;

    try {
      if (endpoint === 'preschools') {
        await adminService.bulkVerifyPreschools(selectedItems);
      } else if (endpoint === 'reviews') {
        await adminService.bulkVerifyReviews(selectedItems);
      }
      toast.success(`${selectedItems.length} ${title.toLowerCase()} verified successfully`);
      setSelectedItems([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to verify items');
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === data.length
        ? []
        : data.map(item => item.id)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {canCreate && (
            <button
              onClick={() => navigate(createPath)}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {title.slice(0, -1)}
            </button>
          )}
        </div>
      </div>

      {/* Search and Bulk Actions */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="max-w-xs relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        {selectedItems.length > 0 && (
          <div className="mt-4 sm:mt-0 flex space-x-2">
            {canVerify && (
              <button
                onClick={handleBulkVerify}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Selected ({selectedItems.length})
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                        checked={selectedItems.length === data.length && data.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                        />
                      </td>
                      {columns.map((column) => (
                        <td key={column.key} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {column.render ? column.render(item) : item[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center space-x-2">
                          {canVerify && (
                            <button
                              onClick={() => handleVerify(item.id, endpoint === 'preschools' ? item.verified_status : item.verified)}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                (endpoint === 'preschools' ? item.verified_status : item.verified)
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {(endpoint === 'preschools' ? item.verified_status : item.verified) ? (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              {(endpoint === 'preschools' ? item.verified_status : item.verified) ? 'Verified' : 'Unverified'}
                            </button>
                          )}
                          {canEdit && (
                            <button
                              onClick={() => navigate(`${editPath}/${item.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{page}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTable;