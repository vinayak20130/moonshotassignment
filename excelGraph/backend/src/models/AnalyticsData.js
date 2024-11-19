const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  ageGroup: {
    type: String,
    enum: ['15-25', '>25'],
    required: true,
    index: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
    index: true,
  },
  metrics: {
    A: { type: Number, required: true },
    B: { type: Number, required: true },
    C: { type: Number, required: true },
    D: { type: Number, required: true },
    E: { type: Number, required: true },
    F: { type: Number, required: true },
  },
});

analyticsSchema.index({ date: 1, ageGroup: 1, gender: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
