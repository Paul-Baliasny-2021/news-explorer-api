const userRouter = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const { getUsers } = require('../controllers/users');

userRouter.get('/', getUsers);

module.exports = userRouter;
