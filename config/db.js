const mongoose = require('mongoose');

const db =
  'mongodb+srv://joseph:1234qwer@cluster0-ie2d2.mongodb.net/test?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);

    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
