const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.DB_URI;

const db = mongoose.connect(DB_URI, {
  // promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  poolSize: 5,
});

mongoose.connection.on('connected', () => {
  console.log(`Mongoose successful connected.`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected.');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Connection to DB closed and app terminated');
    process.exit(1);
  });
});

module.exports = db;
