const Joi = require("joi");
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
const urlRegex =
  /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

const validateAddappUserReq = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.email": "{{#label}} must be a valid email",
    "string.empty": `"email" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  password: Joi.string().min(6).trim().required().messages({
    "string.empty": `"password" cannot be an empty field`,
    "string.min": `"password" should have a minimum length of {#limit}`,
  }),
  full_name: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .regex(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": `"full_name" should contain only alphabets and spaces`,
      "string.empty": `"full_name" cannot be an empty field`,
      "string.min": `"full_name" should have a minimum length of {#limit}`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
    }),
  city: Joi.string().trim().optional().messages({
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  country: Joi.string().trim().optional().messages({
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  dob: Joi.string()
    .trim()
    .regex(/^\d{2}-\d{2}-\d{4}$/)
    .optional()
    .messages({
      "string.pattern.base": `"dob" must be in 'DD-MM-YYYY' format`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
    }),
  gender: Joi.string().valid("male", "female", "other").optional().messages({
    "any.only": `"gender" must be one of 'male', 'female', or 'other'`,
  }),
  crypto_exp: Joi.string()
    .valid(
      "none",
      "beginner",
      "intermediate",
      "advanced",
      "expert",
      "miner-developer"
    )
    .required()
    .messages({
      "any.only": `"crypto_exp" must be one of 'none', 'beginner', 'intermediate', 'advanced', 'expert', 'miner-developer'`,
      "string.empty": `"crypto_exp" cannot be an empty field`,
    }),
});

const validateLoginReq = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.email": "{{#label}} must be a valid email",
    "string.empty": `"email" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  password: Joi.string().required().messages({
    "string.empty": `"password" cannot be an empty field`,
  }),
});

const validateUpdateappUserReq = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .lowercase()
    .trim()
    .optional()
    .messages({
      "string.alphanum": `"username" must contain only letters and numbers`,
      "string.min": `"username" should have a minimum length of {#limit}`,
      "string.max": `"username" should have a maximum length of {#limit}`,
      "string.lowercase": `"username" must be in lowercase`,
      "string.trim": `"username" must not have leading or trailing whitespace`,
    }),

  full_name: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .regex(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": `"full_name" should contain only alphabets and spaces`,
      "string.empty": `"full_name" cannot be an empty field`,
      "string.min": `"full_name" should have a minimum length of {#limit}`,
      "string.trim": `"full_name" must not have leading or trailing whitespace`,
    }),

  city: Joi.string().trim().optional().messages({
    "string.trim": `"city" must not have leading or trailing whitespace`,
  }),

  country: Joi.string().trim().optional().messages({
    "string.trim": `"country" must not have leading or trailing whitespace`,
  }),

  dob: Joi.string()
    .trim()
    .regex(/^\d{2}-\d{2}-\d{4}$/)
    .optional()
    .messages({
      "string.pattern.base": `"dob" must be in 'DD-MM-YYYY' format`,
      "string.trim": `"dob" must not have leading or trailing whitespace`,
    }),

  gender: Joi.string().valid("male", "female", "other").optional().messages({
    "any.only": `"gender" must be one of 'male', 'female', or 'other'`,
  }),

  aboutUs: Joi.string().trim().optional().messages({
    "string.trim": `"aboutUs" must not have leading or trailing whitespace`,
  }),

  crypto_exp: Joi.string()
    .valid(
      "none",
      "beginner",
      "intermediate",
      "advanced",
      "expert",
      "miner-developer"
    )
    .required()
    .messages({
      "any.only": `"crypto_exp" must be one of 'none', 'beginner', 'intermediate', 'advanced', 'expert', 'miner-developer'`,
      "string.empty": `"crypto_exp" cannot be an empty field`,
    }),
});

const validateappUserSpecificColumn = Joi.object({
  column: Joi.string()
    .required()
    .valid("status", "verified", "profile_img")
    .messages({
      "string.empty": `"column" cannot be an empty field`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
    }),
  id: Joi.string().required().messages({
    "string.empty": `"id" cannot be an empty field`,
  }),
  value: Joi.required().messages({
    "string.empty": `"value" cannot be an empty field`,
  }),
});

const validateVerificationCodeReq = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.empty": `"token" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
});

const validateResetPasswordReq = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.empty": `"token" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  password: Joi.string().required().min(6).message({
    "string.empty": `"password" cannot be an empty field`,
    "string.min": `"password" should have a minimum length of {#limit}`,
  }),
  confirmPassword: Joi.string().required().min(6).message({
    "string.empty": `"confirm password" cannot be an empty field`,
    "string.min": `"confirm password" should have a minimum length of {#limit}`,
  }),
});
const validateForgotPasswordReq = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.email": "{{#label}} must be a valid email",
    "string.empty": `"email" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
});

const validateCheckUsernameReq = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .regex(/^[a-zA-Z0-9 _.-]+$/)
    .required()
    .messages({
      "string.empty": `"username" cannot be an empty field`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
      "string.min": `"username" must be at least 3 characters long`,
      "string.pattern.base": `"username" must only contain alphabets, numbers, spaces, underscores, hyphens, and dots`,
    }),
});

const validateProfileCoverImageReq = Joi.object({
  type: Joi.string()
    .valid("profile_cover", "profile_img")
    .trim()
    .optional()
    .messages({
      "string.empty": `"type" cannot be an empty field`,
      "string.trim": `"type" must not have leading or trailing whitespace`,
      "any.only": `"type" must be either 'profile_cover' or 'profile_img'`,
    }),
});

const validatedeleteappUser = Joi.object({
  user_id: Joi.string().required(),
  user_type: Joi.string().valid("admin", "self").required(),
});

module.exports = {
  validateAddappUserReq,
  validateLoginReq,
  validateappUserSpecificColumn,
  validateUpdateappUserReq,
  validateVerificationCodeReq,
  validateForgotPasswordReq,
  validateResetPasswordReq,
  validateCheckUsernameReq,
  validateProfileCoverImageReq,
  validatedeleteappUser,
};
