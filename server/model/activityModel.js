

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  activity: {
    type: String,
    enum: ['registration', 'login', 'logout', 'password_change', 'profile_api_access', 'activity_api_access'],
    required: true
  },

}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);


