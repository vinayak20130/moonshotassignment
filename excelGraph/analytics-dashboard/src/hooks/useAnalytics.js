import { useState, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBarData = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getFeatureMetrics(filters);
      setBarData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLineData = useCallback(async (feature, filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getTimeTrend(feature, filters);
      setLineData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    barData,
    lineData,
    loading,
    error,
    fetchBarData,
    fetchLineData,
  };
};
