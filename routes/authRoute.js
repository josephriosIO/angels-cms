const express = require('express');
const User = require('../models/User');
const { Roles } = require('../models/Roles');
const middleware = require('../middleware/middleware');
const axios = require('axios');
const checkJwt = middleware.checkJwt;
require('dotenv').config();

const router = express.Router();

/**
 * Create a startup based user when startups sign up
 */
router.get('/createOrGetStartup', checkJwt, async (req, res) => {
  try {
    const userInfo = await axios('https://dev-5f25to47.auth0.com/userInfo', {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    const { email, name, sub, picture } = userInfo.data;

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
    return res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Create a user when a non startup signs up
 */
router.get('/createOrGetUser', checkJwt, async (req, res) => {
  try {
    const userInfo = await axios('https://dev-5f25to47.auth0.com/userInfo', {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    const { email, name, sub, picture } = userInfo.data;

    let user = await User.findOne({ email });

    let allRoles = await Roles.findOne({ authId: sub });

    if (user && allRoles) {
      return res.status(200).json(user);
    }

    if (email === process.env.ADMIN_EMAIL) {
      allRoles = new Roles({
        authId: sub,
        roles: {
          ADMIN: true,
          ANGEL: false,
          STARTUP: false,
        },
      });
    } else {
      allRoles = new Roles({
        authId: sub,
      });
    }

    user = new User({
      authId: sub,
      profileImg: picture,
      email,
      name,
    });

    await allRoles.save();
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Get all roles for the user that is logged in
 */
router.get('/getroles', checkJwt, async (req, res) => {
  try {
    let allRoles = await Roles.findOne({ authId: req.user.sub });

    if (!allRoles) {
      return res.status(400).json({ msg: 'No Roles for this user.' });
    }
    return res.status(200).json(allRoles.roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
