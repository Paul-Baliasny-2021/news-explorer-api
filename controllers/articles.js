const Article = require('../models/article');
const ValidationError = require('../errors/validation-err');

module.exports.saveArticle = (req, res, next) => {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  const {
    title, keyword, text, date, source, link, image, owner = req.user._id,
  } = req.body;
  Article.create({
    title, keyword, text, date, source, link, image, owner,
  })
    .then((article) => {
      res.status(201).send({ data: article });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Validation error'));
      }
    })
    .catch(next);
};

module.exports.getMyArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.articleId)
    .then(() => res.status(200).send({ message: 'Article successfully deleted' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid article ID'));
      }
    })
    .catch(next);
};
