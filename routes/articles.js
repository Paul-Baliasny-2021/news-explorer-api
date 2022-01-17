const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  saveArticle,
  getMyArticles,
  deleteArticle,
} = require('../controllers/articles');

articleRouter.get('/', getMyArticles);

articleRouter.post('/', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    keyword: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }),
}), saveArticle);

articleRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().required(),
  }),
}), deleteArticle);

module.exports = articleRouter;
