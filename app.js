const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { registerNewUser, login, getCurrentUser } = require('./controllers/users');

const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, BASE_PATH } = process.env;
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

const app = express();

mongoose.connect('mongodb://localhost:27017/NewsExDB');

app.use(express.static(path.join(__dirname, 'public')));

// External libraries section
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(cors());
app.options('*', cors());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);

// Custom routes section
app.get('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), registerNewUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.get('/users/me', getCurrentUser);
app.use('/users', userRouter);
app.use('/articles', articleRouter);

// Error handling section
app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log(BASE_PATH);
});
