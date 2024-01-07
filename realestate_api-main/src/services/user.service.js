const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

module.exports = {
  createUser: async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userBody);
  },
  getUserByEmail: async (userEmail) => {
    if (!userEmail) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Email is required.`);
    }
    return User.findOne({
      email: userEmail
    })
  },
  getUserById: async (userId) => {
    if (!userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Email is required.`);
    }
    return User.findById(userId);
  },
  updateUserById: async (userId, updateBody) => {
    const user = await User.findById(userId);
    console.log('user', user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  }
};
