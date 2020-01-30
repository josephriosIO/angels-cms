const mongoose = require('mongoose');

const StartupsProfile = new mongoose.Schema({
  authId: {
    type: String,
    required: true,
  },
  missionStatement: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  companyName: {
    type: String,
    default: '',
  },
  companySize: {
    type: String,
    default: '0',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  funded: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  vetted: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },

  phoneNumber: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('startupProfile', StartupsProfile);
