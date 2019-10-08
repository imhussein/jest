const redis = require("redis");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const redisURL = "redis://127.0.0.1:6379";
const util = require("util");

// Redis Client
const redisClient = redis.createClient(redisURL);

// Adding A Method In mongoose.Query prototype to check for the query occurred by mongoose beofre executing the query and if the query key is saved in redis will be served to server from redis server and if not the mongoose query will be executed and return data from mongoDB and save the query to redis for future request for the same query and expire or delete the query from redis on mutation requests

// Make Redis.get Method A callable Promise instead of using callback
redisClient.get = util.promisify(redisClient.get);
// Get Copy Of Exec Method From mongoose.Query.prototype
const { exec } = mongoose.Query.prototype;

// Add Method To Check If UseCache Is Set Or Not
mongoose.Query.prototype.useCache = function() {
  this.cache = true;
  return this;
};

// Modify Mongoose Query Method
mongoose.Query.prototype.exec = async function() {
  // Check For Use Cache
  if (this.useCache) {
    // Create The Key That Will Be Saved To Redis
    const key = JSON.stringify(
      Object.assign(
        {},
        {
          mongooseQuery: this.getQuery()
        },
        {
          collectionName: this.mongooseCollection.name
        }
      )
    );

    // Check For The Key In Redis
    const cachedValue = await redisClient.get(key);

    if (cachedValue) {
      // Return The Model Instance Of The Cached Value In Redis Becaues It is a plain JS Object
      const parsedValue = JSON.parse(cachedValue);

      // Serving From Redis
      console.log("Serving From Redis");

      return !Array.isArray(parsedValue)
        ? new this.model(parsedValue)
        : parsedValue.map(model => new this.model(model));
    }

    console.log("Serving From MongoDB");
    const result = exec.apply(this, arguments);

    // Save The Key In Redis Before Returning It
    redisClient.set(key, JSON.stringify(result));

    // Return The Result
    return result;
  } else {
    // Return The Original Mongoose Query
    return exec.apply(this, arguments);
  }
};

// MongoDB Connect
async function connectTODB() {
  await mongoose.connect("mongodb://localhost:27017/redis", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

// Connect To Mongoose
connectTODB().then(
  () => console.log("MongoDB Connected"),
  err => console.log(err)
);

// User Schema
const UserModel = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// User Model Instance
const User = mongoose.model("users", UserModel);

app.get("/", function(req, res) {
  User.find({
    _id: {
      $exists: true
    },
    name: {
      $exists: true
    },
    isActive: {
      $exists: true
    }
  })
    .sort({ date: 1 })
    .useCache()
    .then(
      response => {
        res.json(response);
      },
      err => {
        res.json(err);
      }
    );
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));
