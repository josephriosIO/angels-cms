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

// Create a new Express app
const app = express();

//connect database
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));

//use the /users router file
app.use('/api/auth', authRoute);
//use the /profile router file
app.use('/api/profile', profileRoute);
//use the /admin router file
app.use('/api/admin', adminRoute);
//use the /admin router file
app.use('/api/user', userRoute);

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.SERVER_PORT || 3001;

// Start the app
app.listen(port, () => console.log(`Server listening on port ${port}`));
