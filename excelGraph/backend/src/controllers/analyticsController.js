const Analytics = require('../models/AnalyticsData');

const analyticsController = {
  getFeatureMetrics: async (req, res) => {
    try {
      const { startDate, endDate, ageGroup, gender } = req.query;

      const query = {};
      if (ageGroup) query.ageGroup = ageGroup.trim();
      if (gender) query.gender = gender.trim();
      if (startDate && endDate) {
        const [sDay, sMonth, sYear] = startDate.trim().split('/');
        const [eDay, eMonth, eYear] = endDate.trim().split('/');

        query.date = {
          $gte: new Date(`${sYear}-${sMonth}-${sDay}`),
          $lte: new Date(`${eYear}-${eMonth}-${eDay}`),
        };
      }

      console.log('Query:', JSON.stringify(query, null, 2));

      const sampleData = await Analytics.findOne(query);
      console.log('Sample matching data:', sampleData);

      const results = await Analytics.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalA: { $sum: '$metrics.A' }, 
            totalB: { $sum: '$metrics.B' },
            totalC: { $sum: '$metrics.C' },
            totalD: { $sum: '$metrics.D' },
            totalE: { $sum: '$metrics.E' },
            totalF: { $sum: '$metrics.F' },
          },
        },
        {
          $project: {
            _id: 0,
            features: [
              { name: 'A', value: '$totalA' },
              { name: 'B', value: '$totalB' },
              { name: 'C', value: '$totalC' },
              { name: 'D', value: '$totalD' },
              { name: 'E', value: '$totalE' },
              { name: 'F', value: '$totalF' },
            ],
          },
        },
      ]);

      console.log('Results:', results);
      res.json(results[0]?.features || []);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getFeatureTimeTrend: async (req, res) => {
    try {
      const { feature, startDate, endDate, ageGroup, gender } = req.query;

      if (!['A', 'B', 'C', 'D', 'E', 'F'].includes(feature)) {
        return res.status(400).json({ error: 'Invalid feature' });
      }

      const query = {};
      if (ageGroup) query.ageGroup = ageGroup.trim();
      if (gender) query.gender = gender.trim();
      if (startDate && endDate) {
        const [sDay, sMonth, sYear] = startDate.trim().split('/');
        const [eDay, eMonth, eYear] = endDate.trim().split('/');
        
        const startDateObj = new Date(`${sYear}-${sMonth}-${sDay}`);
        const endDateObj = new Date(`${eYear}-${eMonth}-${eDay}`);
        startDateObj.setHours(0, 0, 0, 0);
        endDateObj.setHours(23, 59, 59, 999);

        query.date = {
          $gte: startDateObj,
          $lte: endDateObj
        };
      }

      console.log('Query:', JSON.stringify(query, null, 2));

      const timeTrendData = await Analytics.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
            },
            value: { $sum: `$metrics.${feature}` }
          }
        },
        { $sort: { '_id.date': 1 } },
        {
          $project: {
            _id: 0,
            date: '$_id.date',
            value: 1
          }
        }
      ]);

      console.log('Time trend data:', timeTrendData);
      res.json(timeTrendData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getFilterOptions: async (req, res) => {
    try {
      const dateRange = await Analytics.aggregate([
        {
          $group: {
            _id: null,
            minDate: { $min: '$date' },
            maxDate: { $max: '$date' }
          }
        }
      ]);

      console.log('Date range:', dateRange);

      res.json({
        ageGroups: ['15-25', '>25'],
        genders: ['Male', 'Female'],
        features: ['A', 'B', 'C', 'D', 'E', 'F'],
        dateRange: {
          minDate: dateRange[0]?.minDate,
          maxDate: dateRange[0]?.maxDate
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
module.exports = { analyticsController };
