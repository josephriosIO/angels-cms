const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoute');
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');
const path = require('path');
require('dotenv').config();

if (!process.env.ADMIN_EMAIL) {
  throw new Error('Make sure you have ADMIN_EMAIL in your .env file');
}

// Create a new Express server
const server = express();

//connect database
connectDB();

server.use(cors());
server.use(express.json({ extended: false }));

// Serve static files from the React frontend server
server.use(express.static(path.join(__dirname, 'client/build')));

//use the /users router file
server.use('/api/auth', authRoute);
//use the /profile router file
server.use('/api/profile', profileRoute);
//use the /admin router file
server.use('/api/admin', adminRoute);
//use the /admin router file
server.use('/api/user', userRoute);

// Anything that doesn't match the above, send back index.html
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

module.exports = server;
