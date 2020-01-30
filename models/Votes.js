const mongoose = require('mongoose');

const VotesSchema = new mongoose.Schema({
  authId: {
    type: String,
    required: true,
  },
  meetingId: {
    type: String,
    required: true,
  },
  votes: {
    type: Array,
    required: true,
  },
});

module.exports = { Votes: mongoose.model('votes', VotesSchema) };
