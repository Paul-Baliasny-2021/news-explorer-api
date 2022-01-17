const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { errors } = require('celebrate');
const centralErrHandler = require('./middleware/centralized-err-handler');
const { requestLogger, errorLogger } = require('./middleware/logger');
const limiter = require('./middleware/limiter');
const appRouter = require('./routes/index');

const { PORT = 3000, BASE_PATH = 'mongodb://localhost:27017/NewsExDB' } = process.env;
const app = express();

mongoose.connect(BASE_PATH);

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.options('*', cors());
app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// Custom routes section
app.use('/', appRouter);

// Error handling section
app.use(errorLogger);

app.use(errors());

app.use(centralErrHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
