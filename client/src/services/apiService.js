import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Preschool endpoints
export const preschoolService = {
  getAllPreschools: (params) => apiClient.get('/preschools', { params }),
  getPreschoolById: (id) => apiClient.get(`/preschools/${id}`),
  addPreschool: (data) => apiClient.post('/preschools', data),
  updatePreschool: (id, data) => apiClient.put(`/preschools/${id}`, data),
};

// Comparison endpoints
export const comparisonService = {
  compareAdmission: (preschoolIds) =>
    apiClient.post('/comparison/admission', { preschool_ids: preschoolIds }),
  compareFranchise: (preschoolIds) =>
    apiClient.post('/comparison/franchise', { preschool_ids: preschoolIds }),
  getComparisonHistory: () => apiClient.get('/comparison/history'),
};

// Google Maps endpoints
export const googleMapsService = {
  fetchFromGoogleMaps: (data) => apiClient.post('/google-maps/fetch', data),
  searchGooglePlaces: (params) =>
    apiClient.get('/google-maps/search', { params }),
};

// Reviews endpoints
export const reviewService = {
  getReviews: (params) => apiClient.get('/reviews', { params }),
  submitReview: (preschoolId, data) =>
    apiClient.post(`/reviews/${preschoolId}`, data),
  verifyReview: (reviewId) => apiClient.put(`/reviews/${reviewId}/verify`),
  rejectReview: (reviewId) => apiClient.delete(`/reviews/${reviewId}/reject`),
  getPendingReviews: (params) =>
    apiClient.get('/reviews/admin/pending', { params }),
};

// Admin endpoints
export const adminService = {
  login: (credentials) => apiClient.post('/admin/login', credentials),
  getDashboardStats: () => {
    const token = localStorage.getItem('adminToken');
    return apiClient.get('/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getPreschools: (params) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.get('/admin/preschools', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  createPreschool: (data) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.post('/admin/preschools', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updatePreschool: (id, data) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.put(`/admin/preschools/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  deletePreschool: (id) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.delete(`/admin/preschools/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getReviews: (params) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.get('/admin/reviews', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updateReview: (id, data) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.put(`/admin/reviews/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  deleteReview: (id) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.delete(`/admin/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getAdmins: () => {
    const token = localStorage.getItem('adminToken');
    return apiClient.get('/admin/admins', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  createAdmin: (data) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.post('/admin/admins', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updateAdmin: (id, data) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.put(`/admin/admins/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  deleteAdmin: (id) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.delete(`/admin/admins/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  bulkVerifyPreschools: (ids) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.post('/admin/bulk/verify-preschools', { ids }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  bulkVerifyReviews: (ids) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.post('/admin/bulk/verify-reviews', { ids }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  bulkDelete: (model, ids) => {
    const token = localStorage.getItem('adminToken');
    return apiClient.post('/admin/bulk/delete', { model, ids }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default apiClient;
