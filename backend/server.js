const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const middleware = require('./middleware/middleware');
const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoute');
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');
require('dotenv').config();

const checkJwt = middleware.checkJwt;

if (!process.env.ADMIN_EMAIL) {
  throw new Error('Make sure you have ADMIN_EMAIL in your .env file');
}

// Create a new Express app
const app = express();

//connect database
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

//use the /users router file
app.use('/api/auth', authRoute);
//use the /profile router file
app.use('/api/profile', profileRoute);
//use the /admin router file
app.use('/api/admin', adminRoute);
//use the /admin router file
app.use('/api/user', userRoute);

// Define an endpoint that must be called with an access token
app.get('/api/external', checkJwt, (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!',
  });
});

const port = process.env.SERVER_PORT || 3001;

// Start the app
app.listen(port, () => console.log(`Server listening on port ${port}`));
