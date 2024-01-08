const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiError = require('../utils/ApiError');

module.exports = {
  login: catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    console.log('1.user', user);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `Please login using registered Email`);
    }
    const isPasswordMatch = await user.isPasswordMatch(password);
    console.log('isPasswordMatch', isPasswordMatch);
    if (!user || !isPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    const tokens = await tokenService.generateAuthTokens(user);
    console.log('tokens', tokens);
    res.send({ user, tokens });
  }),

  logout: catchAsync(async (req, res) => {
    console.log('HERE I AM');
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  refreshTokens: catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  })
}