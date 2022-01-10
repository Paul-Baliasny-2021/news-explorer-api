const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /https?:\/\/[www.]?[A-Za-z0-9\-._~:/?%#[\]@!$&'()*+,;=][.a-z]?\/?#?/.test(link);
      },
      message: (props) => `${props.value} is not a valid link for article`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /https?:\/\/[www.]?[A-Za-z0-9\-._~:/?%#[\]@!$&'()*+,;=][.a-z]?\/?#?/.test(link);
      },
      message: (props) => `${props.value} is not a valid link for article image`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
