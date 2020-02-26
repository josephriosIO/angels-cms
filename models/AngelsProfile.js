const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  authId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  facebook: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('angelsProfile', ProfileSchema);
