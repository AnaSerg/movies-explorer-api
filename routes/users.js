const { Router } = require('express');
const {
  getCurrentUser,
  updateUserInfo
} = require('../controllers/users');
const {
  validateCurrentUser,
  validateUpdateUser
} = require('../middlewares/validation');

const userRouter = Router();
userRouter.get('/users/me', validateCurrentUser, getCurrentUser);
userRouter.patch('/user/me', validateUpdateUser, updateUserInfo);

module.exports = userRouter;