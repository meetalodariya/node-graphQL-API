const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
  createUser: async function ({ UserInput }, req) {
    const email = UserInput.email;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User already exists");
    }
    const hashPW = await bcrypt.hash(UserInput.password, 12);
    const user = new User({
      name: UserInput.name,
      email: email,
      password: hashPW,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, message: "created" };
  },
  login: async function ({ email, password }, req) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Incorrect Password");
      error.status = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: email,
        userId: user._id.toString(),
      },
      "mysecret",
      { expiresIn: "1h" }
    );
    return { token: token, userId: user._id.toString() };
  },
};
