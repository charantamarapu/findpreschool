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

// Details endpoints
export const detailsService = {
  updateAdmissionDetails: (preschoolId, data) =>
    apiClient.put(`/details/admission/${preschoolId}`, data),
  updateFranchiseDetails: (preschoolId, data) =>
    apiClient.put(`/details/franchise/${preschoolId}`, data),
  getFranchiseOpportunities: (params) =>
    apiClient.get('/details/franchise/opportunities', { params }),
};

export default apiClient;
