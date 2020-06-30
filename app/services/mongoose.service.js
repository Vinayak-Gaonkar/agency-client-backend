const mongoose = require('mongoose');
const config = require("../../config/default.config");

let count = 0;

const options = {
  autoIndex: false,
  // reconnectTries: 30,
  // reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connectWithRetry = () => {
  console.log('moongoDB connection with retry')
  mongoose.connect(config.DB_URL, options).then(() => {
    console.log("MongoDB connected");
  }).catch(err => {
    console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
    setTimeout(connectWithRetry, 50000);
  });
};

connectWithRetry();

exports.mongoose = mongoose
