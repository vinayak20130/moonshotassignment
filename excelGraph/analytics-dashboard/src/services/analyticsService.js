import api from './api';

export const analyticsService = {
  getFeatureMetrics: async (filters) => {
    const { startDate, endDate, ageGroup, gender } = filters;
    const response = await api.get('/analytics/features', {
      params: { startDate, endDate, ageGroup, gender },
    });
    console.log(response, 'tada');
    return response.data;
  },

  getTimeTrend: async (feature, filters) => {
    const { startDate, endDate, ageGroup, gender } = filters;
    const response = await api.get('/analytics/time-trend', {
      params: { feature, startDate, endDate, ageGroup, gender },
    });
    return response.data;
  },
};
