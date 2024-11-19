import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
 
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
 
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
};

export const dataService = {
  fetchAnalytics: async (filters) => {
    const { ageRange, gender, dateRange } = filters;
    const response = await api.get('/analytics/features', {
      params: {
        startDate: '04/10/2022',  
        endDate: '29/10/2022',    
        ageGroup: ageRange,
        gender: gender === 'all' ? 'Male' : gender  
      }
    });
    return response;
  },

  fetchTimeSeriesData: async (feature, filters) => {
    const { ageRange, gender, dateRange } = filters;
    const response = await api.get('/analytics/time-trend', {
      params: {
        feature,
        startDate: '04/10/2022',  
        endDate: '29/10/2022',    
        ageGroup: ageRange,
        gender: gender === 'all' ? 'Male' : gender  
      }
    });
    return response;
  }
};

export default api;