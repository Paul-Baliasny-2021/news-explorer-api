require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-err');
const User = require('../models/user');

const devSecret = 'qwerty123456';
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        next(new NotFoundError('No users found'));
      }
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  User.findById({ _id: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.registerNewUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const {
        name, email,
      } = req.body;
      User.findOne({ email }).select('+password')
        .then((user) => {
          if (user) {
            next(new ConflictError('User with this email already exists in the database'));
          }
          return User.create({
            name, email, password: hash,
          });
        })
        .then(() => res.status(201).send({ message: 'New user created' }))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            throw new ValidationError('Validation error');
          }
        })
        .catch(next);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devSecret, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    })
    .catch(next);
};
