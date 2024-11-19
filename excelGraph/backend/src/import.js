const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Analytics = require('./models/AnalyticsData');
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/analytics_db')
  .then(async () => {
    try {
      const results = [];
      fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (data) => {
          // Convert DD/MM/YYYY to Date
          const [day, month, year] = data.Day.split('/');
          
          results.push({
            date: new Date(`${year}-${month}-${day}`),
            ageGroup: data.Age,
            gender: data.Gender,
            metrics: {
              A: parseInt(data.A),
              B: parseInt(data.B),
              C: parseInt(data.C),
              D: parseInt(data.D),
              E: parseInt(data.E),
              F: parseInt(data.F)
            }
          });
        })
        .on('end', async () => {
          await Analytics.deleteMany({});
          await Analytics.insertMany(results);
          console.log('Data imported successfully');
          mongoose.connection.close();
        });
    } catch (error) {
      console.error('Error:', error);
      mongoose.connection.close();
    }
  });