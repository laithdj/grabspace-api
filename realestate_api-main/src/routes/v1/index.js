const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const PropertyRoute = require('./property.route');
const config = require('../../config/config');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/property',
    route: PropertyRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
