const Joi = require("joi");

const validateAddblogReq = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .required()
    .messages({
      "string.pattern.base": `"name" should be a type of 'text'`,
      "string.empty": `"name" cannot be an empty field`,
      "string.min": `"name" should have a minimum length of {#limit}`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
    }),
  status: Joi.string().required().valid("Deactive", "Active").messages({
    "string.empty": `"status" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
});

const validateUpdateblogReq = Joi.object({
  id: Joi.string().required().messages({
    "string.pattern.base": `"id" should be a type of 'text'`,
    "string.empty": `"id" cannot be an empty field`,
  }),
  name: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .required()
    .regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .messages({
      "string.pattern.base": `"name" should be a type of 'text'`,
      "string.empty": `"name" cannot be an empty field`,
      "string.min": `"name" should have a minimum length of {#limit}`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
    }),
  status: Joi.string().required().valid("Deactive", "Active").messages({
    "string.empty": `"status" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
});

module.exports = {
  validateAddblogReq,
  validateUpdateblogReq,
};
