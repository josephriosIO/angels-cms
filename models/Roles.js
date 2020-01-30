const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  authId: {
    type: String,
    required: true,
  },
  roles: {
    type: Object,
    default: {
      ADMIN: false,
      ANGEL: false,
      STARTUP: false,
    },
  },
});

module.exports = { Roles: mongoose.model('roles', RoleSchema) };
