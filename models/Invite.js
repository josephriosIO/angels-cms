const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
  createdBy: {
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
  consumedBy: {
    type: String,
    default: '',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('invites', InviteSchema);
