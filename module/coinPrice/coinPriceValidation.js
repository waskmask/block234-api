const Joi = require('joi');

const validateAddCoinPriceReq = Joi.object({
  id: Joi.string().required()
    .messages({
      'string.empty': `"id" cannot be an empty field`,
    }),
  symbol: Joi.string().min(1).max(10).trim().required()
    .messages({
      'string.empty': `"symbol" cannot be an empty field`,
      'string.min': `"symbol" should have at least {#limit} character`,
      'string.max': `"symbol" should have at most {#limit} characters`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  name: Joi.string().min(3).max(50).trim().required()
    .messages({
      'string.empty': `"name" cannot be an empty field`,
      'string.min': `"name" should have a minimum length of {#limit}`,
      'string.max': `"name" should have a maximum length of {#limit}`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  image: Joi.string().uri().required()
    .messages({
      'string.empty': `"image" cannot be an empty field`,
      'string.uri': `"image" must be a valid URL`,
    }),
  current_price: Joi.number().positive().required()
    .messages({
      'number.base': `"current_price" should be a number`,
      'number.positive': `"current_price" must be a positive number`,
      'any.required': `"current_price" is required`,
    }),
  price_change_percentage_24h: Joi.number().required()
    .messages({
      'number.base': `"price_change_percentage_24h" should be a number`,
      'any.required': `"price_change_percentage_24h" is required`,
    }),
});

const validateUpdateCoinPriceReq = Joi.object({
  id: Joi.string().required()
    .messages({
      'string.empty': `"id" cannot be an empty field`,
    }),
  symbol: Joi.string().min(1).max(10).trim()
    .messages({
      'string.empty': `"symbol" cannot be an empty field`,
      'string.min': `"symbol" should have at least {#limit} character`,
      'string.max': `"symbol" should have at most {#limit} characters`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  name: Joi.string().min(3).max(50).trim()
    .messages({
      'string.empty': `"name" cannot be an empty field`,
      'string.min': `"name" should have a minimum length of {#limit}`,
      'string.max': `"name" should have a maximum length of {#limit}`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  image: Joi.string().uri()
    .messages({
      'string.uri': `"image" must be a valid URL`,
    }),
  current_price: Joi.number().positive()
    .messages({
      'number.base': `"current_price" should be a number`,
      'number.positive': `"current_price" must be a positive number`,
    }),
  price_change_percentage_24h: Joi.number()
    .messages({
      'number.base': `"price_change_percentage_24h" should be a number`,
    }),
});

module.exports = {
  validateAddCoinPriceReq,
  validateUpdateCoinPriceReq
};
