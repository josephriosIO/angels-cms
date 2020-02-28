const mongoose = require('mongoose');

const StartupsInviteSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
  consumed: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('startupsInvite', StartupsInviteSchema);
