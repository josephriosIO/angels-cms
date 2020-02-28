const express = require('express');
const Invite = require('../models/Invite');
const User = require('../models/User');
const { Roles } = require('../models/Roles');
const { Votes } = require('../models/Votes');
const AngelsProfile = require('../models/AngelsProfile');
const Meetings = require('../models/Meetings');
const StartupsProfile = require('../models/StartupsProfile');
const middleware = require('../middleware/middleware');
const StartupsInvite = require('../models/StartupsInvite');
const axios = require('axios');
const checkJwt = middleware.checkJwt;
const addRoleToUser = middleware.addRoleToUser;

const router = express.Router();

// Roles for Users
const UserRoles = {
  ADMIN: 'ADMIN',
  ANGEL: 'ANGEL',
  STARTUP: 'STARTUP',
};

/**
 *  Get community members profile based on the id given
 */
router.get('/getAngel/profile/:id', checkJwt, async (req, res) => {
  try {
    let profile = await AngelsProfile.findOne({ authId: req.params.id });

    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Get community member based on the id given
 */
router.get('/getAngel/:id', checkJwt, async (req, res) => {
  try {
    let profile = await User.findOne({ authId: req.params.id });

    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * get all community members available
 */
router.get('/getAngels', checkJwt, async (req, res) => {
  try {
    const users = await Roles.find({});

    const userRoles = [];
    users.forEach(user => {
      if (user.roles.ANGEL) {
        userRoles.push(user);
      }
    });

    const userIds = userRoles.map(({ authId }) => {
      return authId;
    });

    if (userIds.length < 1) {
      return res.status(200).json([]);
    }

    const usersQuery = await User.find({});

    const userArr = [];
    usersQuery.forEach(user => {
      userIds.map(id => {
        if (user.authId === id) {
          userArr.push(user);
        }
      });
    });

    return res.status(200).json(userArr);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Consume invite as a user if code is valid add community member role to user
 */
router.post('/consumeInvite', checkJwt, async (req, res) => {
  try {
    const { invite } = req.body;
    let code = await Invite.findOne({ value: invite });

    if (!code) {
      throw new Error('Invite is not valid.');
    }
    if (code.consumed) {
      throw new Error('Code has been consumed.');
    }
    await addRoleToUser(req.user.sub, UserRoles.ANGEL);

    let updateInvite = {};

    updateInvite = {};
    updateInvite.consumed = true;
    updateInvite.consumedBy = req.user.sub;

    //update
    code = await Invite.findOneAndUpdate(
      { value: invite },
      { $set: updateInvite },
      { new: true },
    );

    return res.status(200).json(code);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Can the user vote on the meeting in question
 */
router.post('/canvote', checkJwt, async (req, res) => {
  try {
    const meetingDate = new Date(req.body.date);
    const current = new Date();

    const bool = current.getTime() > meetingDate.getTime();

    return res.status(200).json(bool);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Get all meetings created new and old.
 */
router.get('/getmeetings', checkJwt, async (req, res) => {
  try {
    const users = await Meetings.find({});

    const meetingsInfo = [];
    users.forEach(user => {
      meetingsInfo.push(user);
    });

    return res.status(200).json(meetingsInfo);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

/**
 * Get certain meeting based on that meeting id
 */
router.get('/getmeeting/:id', checkJwt, async (req, res) => {
  try {
    let meeting = await Meetings.findOne({ meetingId: req.params.id });

    return res.json(meeting);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

/**
 * Check if user has voted on the meeting in question
 */
router.get('/hasvoted/:id', checkJwt, async (req, res) => {
  try {
    let voted = await Votes.findOne({
      meetingId: req.params.id,
      authId: req.user.sub,
    });

    return res.status(200).json(voted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err });
  }
});

/**
 * Vote on meeting for the user logged in
 */
router.post('/voteonmeeting/:id', checkJwt, async (req, res) => {
  try {
    let vote = await Votes.findOne({
      meetingId: req.params.id,
      authId: req.user.sub,
    });

    if (vote) {
      throw new Error('Already voted.');
    }

    vote = new Votes({
      meetingId: req.params.id,
      authId: req.user.sub,
      votes: req.body.votes,
    });

    await vote.save();
    return res.status(200).json(vote);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err });
  }
});

/**
 * Consume invite as a user if code is valid add community member role to user
 */
router.post('/consumeInviteAsAStartup', checkJwt, async (req, res) => {
  try {
    const { invite } = req.body;
    const userInfo = await axios('https://dev-5f25to47.auth0.com/userInfo', {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    const { name, sub, picture } = userInfo.data;

    let code = await StartupsInvite.findOne({ value: invite });

    if (!code) {
      throw new Error('Invite is not valid.');
    }
    if (code.consumed) {
      throw new Error('Code has been consumed.');
    }

    const { email, companyName, website } = code;

    let user = await User.findOne({ email });

    let allRoles = await Roles.findOne({ authId: sub });

    if (user && allRoles) {
      return res.status(200).json(user);
    }

    allRoles = new Roles({
      authId: sub,
      roles: {
        ADMIN: false,
        ANGEL: false,
        STARTUP: true,
      },
    });

    user = new User({
      authId: sub,
      profileImg: picture,
      email,
      name,
    });

    await allRoles.save();
    await user.save();

    // create startup profile

    //build profile object
    let profileFields = {};
    profileFields.user = sub;

    profileFields = {};
    if (sub) profileFields.authId = sub;
    if (companyName) profileFields.companyName = companyName;
    if (website) profileFields.website = website;

    profileFields.completed = true;
    let profile = await StartupsProfile.findOne({ authId: sub });
    if (profile) {
      //update
      profile = await StartupsProfile.findOneAndUpdate(
        { authId: sub },
        { $set: profileFields },
        { new: true },
      );
    } else {
      profile = new StartupsProfile(profileFields);
      await profile.save();
    }

    let updateInvite = {};

    updateInvite = {};
    updateInvite.consumed = true;
    updateInvite.consumedBy = req.user.sub;

    //update
    code = await Invite.findOneAndUpdate(
      { value: invite },
      { $set: updateInvite },
      { new: true },
    );

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

module.exports = router;
