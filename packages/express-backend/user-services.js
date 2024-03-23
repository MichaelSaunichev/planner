import mongoose from "mongoose";
import userModel from "./users.js";
import dotenv from "dotenv"

mongoose.set("debug", true);
dotenv.config()
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

async function checkMongoConnection() {
  let mongoStatus;
  try {
    await mongoose.connection.db.admin().ping();
    mongoStatus = 'ok';
  } catch (error) {
    console.error('MongoDB connection error:', error);
    mongoStatus = 'error';
  }
  return mongoStatus;
}

function findUserById(id) {
    return userModel.findById(id);
}

function getUsers(name) {
    let promise;
    if (name === undefined) {
      promise = userModel.find();
    } else {
      promise = findUserByName(name);
    }
    return promise;
}

function findUserByUsernameAndPassword(username, password) {
  return userModel.findOne({ username, password })
    .then((user) => {
      return user || null;
    });
}

function getUser(username, password) {
  // console.log({username, password})
  let promise;

  if (username === undefined && password === undefined) {
    promise = userModel.find();
  } else {
    promise = findUserByUsernameAndPassword(username, password);
  }

  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function deleteUser(id){
  return userModel.findOneAndDelete({ _id: id });
}

function addUser(user) {
  // Check if the user already exists
  return userModel.findOne({ username: user.username })
    .then(existingUser => {
      if (existingUser) {
        // User already exists, handle accordingly
        throw new Error('User already exists');
      } else {
        // User does not exist, proceed with adding the new user
        const userToAdd = new userModel(user);
        return userToAdd.save();
      }
    })
    .then(result => {
      return result;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export default {
  checkMongoConnection,
  getUsers,
  getUser,
  findUserById,
  deleteUser,
  addUser
};

