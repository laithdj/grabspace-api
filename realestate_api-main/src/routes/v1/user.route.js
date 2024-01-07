const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.route('/').post(userController.createUser);

router.route('/:userId').get(userController.getUserById);
router.route('/:userId').put(userController.updateUser);

// router.route('/').get(userController.createUser);
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);
//   router
//   .get('/getUserDetails', auth(), userController.getUserDetails);
// router
//   .route('/:userId')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
//   .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;