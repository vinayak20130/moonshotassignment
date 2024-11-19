// src/pages/Dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Calendar, RefreshCw } from 'lucide-react';
import Cookies from 'js-cookie';
import { dataService } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { FeatureBarChart } from '../components/charts/FeatureBarChart';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import FilterPanel from '../components/filters/FilterPanel';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import ShareButton from '../components/shared/ShareButton';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const mainContentRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(
    JSON.parse(Cookies.get('barChartData') || '[]')
  );
  const [selectedFeature, setSelectedFeature] = useState(
    Cookies.get('selectedFeature') || null
  );
  const [timeSeriesData, setTimeSeriesData] = useState(
    JSON.parse(Cookies.get('timeSeriesData') || '[]')
  );

  const [filters, setFilters] = useState({
    ageRange:
      searchParams.get('ageRange') || Cookies.get('ageRange') || '15-25',
    gender: searchParams.get('gender') || Cookies.get('gender') || 'Male',
    dateRange: {
      start: '04/10/2022',
      end: '29/10/2022',
    },
  });

  useEffect(() => {
    if (data.length > 0) {
      Cookies.set('barChartData', JSON.stringify(data), { expires: 7 });
    }
  }, [data]);

  useEffect(() => {
    if (timeSeriesData.length > 0) {
      Cookies.set('timeSeriesData', JSON.stringify(timeSeriesData), {
        expires: 7,
      });
      if (selectedFeature) {
        Cookies.set('selectedFeature', selectedFeature, { expires: 7 });
      }
    }
  }, [timeSeriesData, selectedFeature]);

  useEffect(() => {
    const handleWheel = (e) => {
      const isChartContainer = e.target.closest('.chart-container');
      if (isChartContainer) {
        e.preventDefault();
      }
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        mainContent.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  useEffect(() => {
    fetchData();
    updateUrlAndCookies();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dataService.fetchAnalytics(filters);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateUrlAndCookies = () => {
    setSearchParams({
      ageRange: filters.ageRange,
      gender: filters.gender,
      startDate: filters.dateRange.start,
      endDate: filters.dateRange.end,
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          Cookies.set(`${key}_${subKey}`, subValue, { expires: 7 });
        });
      } else {
        Cookies.set(key, value, { expires: 7 });
      }
    });
  };

  const handleFeatureClick = async (feature) => {
    setSelectedFeature(feature);
    try {
      const response = await dataService.fetchTimeSeriesData(feature, filters);
      setTimeSeriesData(response.data);
    } catch (error) {
      console.error('Error fetching time series data:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    Cookies.remove('barChartData');
    Cookies.remove('timeSeriesData');
    Cookies.remove('selectedFeature');
    Object.keys(filters).forEach((key) => {
      Cookies.remove(key);
      if (typeof filters[key] === 'object') {
        Object.keys(filters[key]).forEach((subKey) => {
          Cookies.remove(`${key}_${subKey}`);
        });
      }
    });

    setSelectedFeature(null);
    setTimeSeriesData([]);
    setData([]);

    setFilters({
      ageRange: '15-25',
      gender: 'Male',
      dateRange: {
        start: '04/10/2022',
        end: '29/10/2022',
      },
    });
  };

  useEffect(() => {
    const savedBarData = Cookies.get('barChartData');
    const savedFeature = Cookies.get('selectedFeature');
    const savedTimeSeriesData = Cookies.get('timeSeriesData');

    if (savedBarData) {
      setData(JSON.parse(savedBarData));
    }

    if (savedFeature && savedTimeSeriesData) {
      setSelectedFeature(savedFeature);
      setTimeSeriesData(JSON.parse(savedTimeSeriesData));
    }

    if (!savedBarData) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Overview
              </h1>
              <p className="mt-1 text-gray-500">
                Track and analyze your product usage metrics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Date Range
                </h2>
              </div>
              <DateRangeFilter
                startDate={filters.dateRange.start}
                endDate={filters.dateRange.end}
                onChange={(dates) =>
                  handleFilterChange({
                    dateRange: dates,
                  })
                }
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Feature Usage
                  </h2>
                  <p className="text-sm text-gray-500">
                    Click on bars to see detailed trends
                  </p>
                </div>
                <ShareButton filters={filters} />
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <FeatureBarChart
                  data={data}
                  onFeatureClick={handleFeatureClick}
                />
              )}
            </div>

            {selectedFeature && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Time Trend: {selectedFeature}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Historical usage data for selected feature
                    </p>
                  </div>
                  <ShareButton
                    filters={{ ...filters, feature: selectedFeature }}
                  />
                </div>
                <TimeSeriesChart data={timeSeriesData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
