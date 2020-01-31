const express = require('express');
const Invite = require('../models/Invite');
const User = require('../models/User');
const { Roles } = require('../models/Roles');
const { Votes } = require('../models/Votes');
const AngelsProfile = require('../models/AngelsProfile');
const Meetings = require('../models/Meetings');
const middleware = require('../middleware/middleware');
const checkJwt = middleware.checkJwt;
const addRoleToUser = middleware.addRoleToUser;

const router = express.Router();

// Roles for Users
const UserRoles = {
  ADMIN: 'ADMIN',
  ANGEL: 'ANGEL',
  STARTUP: 'STARTUP',
};

router.get('/getAngel/profile/:id', checkJwt, async (req, res) => {
  try {
    let profile = await AngelsProfile.findOne({ authId: req.params.id });

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

router.get('/getAngel/:id', checkJwt, async (req, res) => {
  try {
    let profile = await User.findOne({ authId: req.params.id });

    console.log(profile);

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

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
    console.log(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

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
    console.log(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

router.post('/canvote', checkJwt, async (req, res) => {
  try {
    const meetingDate = new Date(req.body.date);
    const current = new Date();

    const bool = current.getTime() > meetingDate.getTime();

    return res.status(200).json(bool);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

router.get('/getmeetings', checkJwt, async (req, res) => {
  try {
    const users = await Meetings.find({});

    const meetingsInfo = [];
    users.forEach(user => {
      meetingsInfo.push(user);
    });

    return res.status(200).json(meetingsInfo);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get('/getmeeting/:id', checkJwt, async (req, res) => {
  try {
    let meeting = await Meetings.findOne({ meetingId: req.params.id });

    return res.json(meeting);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.get('/hasvoted/:id', checkJwt, async (req, res) => {
  try {
    let voted = await Votes.findOne({
      meetingId: req.params.id,
      authId: req.user.sub,
    });

    return res.status(200).json(voted);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }
});

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
    console.log(err);
    return res.status(500).json({ msg: err });
  }
});

module.exports = router;
