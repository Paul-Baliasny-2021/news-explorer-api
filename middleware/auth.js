require('dotenv').config();
const jwt = require('jsonwebtoken');

const devSecret = 'qwerty123456';
const { NODE_ENV, JWT_SECRET } = process.env;

/* eslint consistent-return: "off" */
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Authorization Required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devSecret);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Authorization Required' });
  }

  req.user = payload;

  next();
};

module.exports = auth;
