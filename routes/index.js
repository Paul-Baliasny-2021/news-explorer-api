const appRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const articleRouter = require('./articles');
const auth = require('../middleware/auth');
const { registerNewUser, login, getCurrentUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

appRouter.get('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

appRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), registerNewUser);

appRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

appRouter.use(auth);

appRouter.get('/users/me', getCurrentUser);
appRouter.use('/users', userRouter);

appRouter.use('/articles', articleRouter);

module.exports = appRouter;
