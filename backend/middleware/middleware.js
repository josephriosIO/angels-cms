const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { Roles } = require('../models/Roles');
const { Votes } = require('../models/Votes');

// Set up Auth0 configuration
const authConfig = {
  domain: 'dev-5f25to47.auth0.com',
  audience: 'https://dev-5f25to47.auth0.com/api/v2/',
};

exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256'],
});

exports.addRoleToUser = async (id, role) => {
  //update roles object
  try {
    let usersRoles = await Roles.findOne({ authId: id });

    const newRoles = { ...usersRoles.roles, [role]: true };

    usersRoles = await Roles.findOneAndUpdate(
      { authId: id },
      { roles: newRoles },
      { new: true },
    );
  } catch (err) {
    console.error(err.message);
  }
};

exports.removeRoleToUser = async (id, role) => {
  //update roles object
  try {
    let user = await Roles.findOne({ authId: id });

    const newRoles = { ...user.roles, [role]: false };

    user = await Roles.findOneAndUpdate(
      { authId: id },
      { roles: newRoles },
      { new: true },
    );
  } catch (err) {
    console.error(err.message);
  }
};

exports.getVotesByMeeting = async id => {
  let vote = await Votes.find({});
  const userRoles = [];
  vote.forEach(user => {
    if (user.meetingId === id) {
      userRoles.push(user);
    }
  });
  return userRoles;
};
