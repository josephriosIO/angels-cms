const express = require('express');
const User = require('../models/User');
const { Roles } = require('../models/Roles');
const { Votes } = require('../models/Votes');
const Invite = require('../models/Invite');
const middleware = require('../middleware/middleware');
const AngelsProfile = require('../models/AngelsProfile');
const StartupsProfile = require('../models/StartupsProfile');
const Meetings = require('../models/Meetings');
const uuidv4 = require('uuid/v4');
const checkJwt = middleware.checkJwt;
const addRoleToUser = middleware.addRoleToUser;
const removeRoleToUser = middleware.removeRoleToUser;
const getVotesByMeeting = middleware.getVotesByMeeting;

const router = express.Router();

// Roles for Users
const userRoles = {
  ADMIN: 'ADMIN',
  ANGEL: 'ANGEL',
  STARTUP: 'STARTUP',
};

async function checkIfUserHasRole(userId, role) {
  let user = await Roles.findOne({ authId: userId });
  if (user.roles[role] !== true) {
    return false;
  }

  return true;
}

/**
 * Add angel role to user based on the users ID
 */
router.get('/add/angelrole/user/:id', checkJwt, async (req, res) => {
  try {
    if (await checkIfUserHasRole(req.params.id, [userRoles.ANGEL])) {
      await removeRoleToUser(req.params.id, userRoles.ANGEL);
      return res.status(200).json({ msg: 'Role removed.' });
    }

    await addRoleToUser(req.params.id, userRoles.ANGEL);
    return res.status(200).json({ msg: 'Role added.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Add Admin role to user based on the users ID
 */
router.get('/add/adminrole/user/:id', checkJwt, async (req, res) => {
  try {
    if (await checkIfUserHasRole(req.params.id, [userRoles.ADMIN])) {
      await removeRoleToUser(req.params.id, userRoles.ADMIN);
      return res.status(200).json({ msg: 'Role removed.' });
    }

    await addRoleToUser(req.params.id, userRoles.ADMIN);
    return res.status(200).json({ msg: 'Role added.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Grab all startups that haven't been archived by the admin
 */
router.get('/allstartups', checkJwt, async (req, res) => {
  try {
    const users = await Roles.find({});

    const userRoles = [];
    users.forEach(user => {
      if (user.roles.STARTUP) {
        userRoles.push(user);
      }
    });

    const userIds = userRoles.map(({ authId }) => {
      return authId;
    });

    if (userIds.length < 1) {
      return res.status(200).json([]);
    }

    const usersQuery = await StartupsProfile.find({});

    const startupsProfiles = [];
    usersQuery.forEach(user => {
      userIds.map(id => {
        if (user.authId === id) {
          startupsProfiles.push(user);
        }
      });
    });

    const filtered = startupsProfiles.filter(startup => !startup.archived);

    return res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Archive a startup based on their ID
 */
router.get('/archivestartup/:id', checkJwt, async (req, res) => {
  //build profile object
  try {
    let profile = await StartupsProfile.findOne({ authId: req.params.id });

    let profileFields = Boolean;

    if (profile.archived) {
      profileFields = false;
    } else {
      profileFields = true;
    }

    //update
    profile = await StartupsProfile.findOneAndUpdate(
      { authId: req.params.id },
      { archived: profileFields },
      { new: true },
    );
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Vet a startup for meetings based on the ID
 */
router.get('/vettstartup/:id', checkJwt, async (req, res) => {
  try {
    let profile = await StartupsProfile.findOne({ authId: req.params.id });
    let profileFields = Boolean;

    if (profile.vetted) {
      profileFields = false;
    } else {
      profileFields = true;
    }

    //update
    profile = await StartupsProfile.findOneAndUpdate(
      { authId: req.params.id },
      { vetted: profileFields },
      { new: true },
    );
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Delete the startup based on the startups ID
 */
router.delete('/deletestartup/:id', checkJwt, async (req, res) => {
  //build profile object
  try {
    //delete
    await StartupsProfile.findOneAndDelete({
      authId: req.params.id,
    });
    await User.findOneAndDelete({
      authId: req.params.id,
    });
    await Roles.findOneAndDelete({
      authId: req.params.id,
    });
    return res.json('Deleted');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Delete the startup based on the startups ID
 */
router.delete('/deleteuser/:id', checkJwt, async (req, res) => {
  try {
    //delete
    await User.findOneAndDelete({
      authId: req.params.id,
    });
    await AngelsProfile.findOneAndDelete({
      authId: req.params.id,
    });
    await Roles.findOneAndDelete({
      authId: req.params.id,
    });
    return res.json('Deleted');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Grab all archived startups
 */
router.get('/archivedstartups', checkJwt, async (req, res) => {
  try {
    const users = await Roles.find({});

    const userRoles = [];
    users.forEach(user => {
      if (user.roles.STARTUP) {
        userRoles.push(user);
      }
    });

    const userIds = userRoles.map(({ authId }) => {
      return authId;
    });

    if (userIds.length < 1) {
      return res.status(200).json([]);
    }

    const usersQuery = await StartupsProfile.find({});

    const startups = [];
    usersQuery.forEach(user => {
      userIds.map(id => {
        if (user.authId === id) {
          startups.push(user);
        }
      });
    });

    const filtered = startups.filter(startup => startup.archived);

    return res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Grab all vetted startups.
 */
router.get('/vettedstartups', checkJwt, async (req, res) => {
  try {
    const users = await Roles.find({});

    const userRoles = [];
    users.forEach(user => {
      if (user.roles.STARTUP) {
        userRoles.push(user);
      }
    });

    const userIds = userRoles.map(({ authId }) => {
      return authId;
    });

    if (userIds.length < 1) {
      return res.status(200).json([]);
    }

    const usersQuery = await StartupsProfile.find({});

    const startups = [];
    usersQuery.forEach(user => {
      userIds.map(id => {
        if (user.authId === id) {
          startups.push(user);
        }
      });
    });

    const filtered = startups.filter(
      startup => !startup.archived && startup.vetted,
    );

    return res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Grab all users that aren't a startup that includes ADMIN, community members and non members
 */
router.get('/users', checkJwt, async (req, res) => {
  try {
    const users = await Roles.find({});

    const userRoles = [];
    users.forEach(user => {
      if (!user.roles.STARTUP) {
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
        if (req.user.sub !== id) {
          if (user.authId === id) {
            userArr.push(user);
          }
        } 
      });
    });

    return res.status(200).json(userArr);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Get roles for the user based on the ID that's given
 */
router.get('/getroles/:id', checkJwt, async (req, res) => {
  try {
    const { id } = req.params;
    let user = await Roles.findOne({ authId: id });
    if (!user.roles) {
      return res.status(400).json({ msg: 'No Roles for this user.' });
    }
    return res.status(200).json(user.roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Create an invite for users to instantly become an community member
 */
router.get('/createinvite', checkJwt, async (req, res) => {
  try {
    const inviteCode = uuidv4();

    let code = await Invite.findOne({ value: inviteCode });

    if (code) {
      return res.status(200).json(code);
    }

    code = new Invite({
      createdBy: req.user.sub,
      value: inviteCode,
    });

    await code.save();
    return res.status(200).json(code);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Create a meeting with startups that will be included with that meeting with a date and title.
 */
router.post('/createmeeting', checkJwt, async (req, res) => {
  try {
    const meetingId = uuidv4();
    const { startups, date, title } = req.body.data;

    let createdMeeting = await Meetings.findOne({ meetingId: meetingId });

    if (createdMeeting) {
      return res.status(200).json(createdMeeting);
    }

    createdMeeting = new Meetings({
      meetingId,
      title,
      date,
      startups,
    });

    await createdMeeting.save();
    return res.status(200).json(createdMeeting);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * get total points based on users group vote and add them all up
 */
router.get('/totalpoints/meeting/:id', checkJwt, async (req, res) => {
  try {
    const votes = await getVotesByMeeting(req.params.id);

    const voteTotals = votes.reduce((aggr, curr) => {
      const copy = { ...aggr };
      const v = curr.votes;

      const gVote = v[0].groupVote.startup.authId;

      if (copy[gVote]) {
        copy[gVote] += 1;
      } else {
        copy[gVote] = 1;
      }
      return copy;
    }, {});

    return res.status(200).json(voteTotals);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * get all users votes that voted for that meeting
 */
router.get('/votes/meeting/:id', checkJwt, async (req, res) => {
  try {
    const { id } = req.params;
    let vote = await Votes.find({});
    const userRoles = [];
    vote.forEach(user => {
      if (user.meetingId === id) {
        userRoles.push(user);
      }
    });

    return res.status(200).json(userRoles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * If meeting isn't already up for user vote allow admin to update meeting even deleting it
 */
router.put('/updatemeeting/:id', checkJwt, async (req, res) => {
  try {
    const { title, startups, date } = req.body.data;

    let profileFields = {};
    profileFields.user = req.params.id;

    profileFields = {};
    if (title) profileFields.title = title;
    if (date) profileFields.date = date;
    if (startups) profileFields.startups = startups;

    let createdMeeting = await Meetings.findOne({ meetingId: req.params.id });

    //update
    createdMeeting = await Meetings.findOneAndUpdate(
      { meetingId: req.params.id },
      { $set: profileFields },
      { new: true },
    );
    return res.json(createdMeeting);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

/**
 * Delete meeting
 */
router.delete('/deletemeeting/:id', checkJwt, async (req, res) => {
  try {
    //delete
    await Meetings.findOneAndDelete({
      meetingId: req.params.id,
    });
    return res.json('Deleted');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

module.exports = router;
