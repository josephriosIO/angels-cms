const express = require('express');
const User = require('../models/User');
const AngelsProfile = require('../models/AngelsProfile');
const StartupsProfile = require('../models/StartupsProfile');
const middleware = require('../middleware/middleware');
const checkJwt = middleware.checkJwt;
const router = express.Router();

router.get('/me', checkJwt, async (req, res) => {
  try {
    let profile = await AngelsProfile.findOne({ authId: req.user.sub });

    if (!profile) {
      profile = new AngelsProfile({
        authId: req.user.sub,
      });
      await profile.save();
      return res.json(profile);
    }

    return res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/getStartups/profile/:id', checkJwt, async (req, res) => {
  try {
    let profile = await StartupsProfile.findOne({ authId: req.params.id });

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Server Error.' });
  }
});

router.get('/startups/me', checkJwt, async (req, res) => {
  try {
    let profile = await StartupsProfile.findOne({ authId: req.user.sub });

    if (!profile) {
      profile = new StartupsProfile({
        authId: req.user.sub,
      });
      await profile.save();
      return res.json(profile);
    }

    return res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/startups/update', checkJwt, async (req, res) => {
  const {
    companyName,
    location,
    website,
    missionStatement,
    companySize,
  } = req.body.form;
  //build profile object
  let profileFields = {};
  profileFields.user = req.user.sub;

  profileFields = {};
  if (companyName) profileFields.companyName = companyName;
  if (location) profileFields.location = location;
  if (website) profileFields.website = website;
  if (companySize) profileFields.companySize = companySize;
  if (missionStatement) profileFields.missionStatement = missionStatement;
  profileFields.completed = true;
  try {
    let profile = await StartupsProfile.findOne({ authId: req.user.sub });
    if (profile) {
      //update
      profile = await StartupsProfile.findOneAndUpdate(
        { authId: req.user.sub },
        { $set: profileFields },
        { new: true },
      );
      return res.json(profile);
    }
    //create
    profile = new StartupsProfile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', checkJwt, async (req, res) => {
  const { name, location, phoneNumber, bio } = req.body.form;
  //build profile object
  let profileFields = {};
  profileFields.user = req.user.sub;

  profileFields = {};
  if (name) profileFields.name = name;
  if (location) profileFields.location = location;
  if (phoneNumber) profileFields.phoneNumber = phoneNumber;
  if (bio) profileFields.bio = bio;
  try {
    let profile = await AngelsProfile.findOne({ authId: req.user.sub });
    if (profile) {
      //update
      profile = await AngelsProfile.findOneAndUpdate(
        { authId: req.user.sub },
        { $set: profileFields },
        { new: true },
      );
      return res.json(profile);
    }
    //create
    profile = new AngelsProfile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
