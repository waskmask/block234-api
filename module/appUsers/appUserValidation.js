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
  gender: Joi.string().valid("Male", "Female", "Other").optional().messages({
    "any.only": `"gender" must be one of 'Male', 'Female', or 'Other'`,
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

const validateUpdateappUserReq = Joi.object({
  email: Joi.string().email().trim().optional().messages({
    "string.email": "{{#label}} must be a valid email",
    "string.empty": `"email" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  username: Joi.string().trim().optional().messages({
    "string.empty": `"username" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  artist_categories: Joi.when("user_type", {
    is: Joi.string().valid("Fan"),
    then: Joi.array().items(Joi.string().trim()).optional(),
    otherwise: Joi.array()
      .items(Joi.string().trim())
      .min(1)
      .required()
      .messages({
        "string.base": `{{#label}} should be a type of string`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
        "array.base": `{{#label}} should be an array`,
        "array.min": `{{#label}} should contain at least 1 item`,
        "object.base": `{{#label}} should be of type object`,
      }),
  }),
  first_name: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .optional()
    .messages({
      "string.pattern.base": `"first_name" should be a type of 'text'`,
      "string.empty": `"first_name" cannot be an empty field`,
      "string.min": `"first_name" should have a minimum length of {#limit}`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
    }),
  last_name: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .optional()
    .messages({
      "string.pattern.base": `"last_name" should be a type of 'text'`,
      "string.empty": `"last_name" cannot be an empty field`,
      "string.min": `"last_name" should have a minimum length of {#limit}`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
    }),
  full_name: Joi.string()
    .min(3)
    .max(20)
    .trim()
    .regex(
      /^[A-Za-z\u00C0-\u017F\s\-']{1,}[\.]{0,1}[A-Za-z\u00C0-\u017F\s\-']{0,}$/
    )
    .required()
    .messages({
      "string.pattern.base": `"full_name" should be a type of 'text'`,
      "string.empty": `"full_name" cannot be an empty field`,
      "string.min": `"full_name" should have a minimum length of {#limit}`,
      "string.trim": "{{#label}} must not have leading or trailing whitespace",
    }),

  gender: Joi.string().required().valid("Male", "Female", "Other").messages({
    "string.empty": `"gender" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
    "any.only": "Invalid gender value",
  }),
  visibility: Joi.string().optional().valid("Private", "Public").messages({
    "string.empty": `"visibility" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
    "any.only": "Invalid visibility value",
  }),
  date_of_birth: Joi.date().required().messages({
    "string.empty": `"date of birth" cannot be an empty field`,
  }), // Add Joi validation for date_of_birth field
  city: Joi.string().trim().required().messages({
    "string.empty": `"city" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  // state: Joi.string().trim().required().messages({
  //     'string.empty': `"state" cannot be an empty field`,
  //     'string.trim': '{{#label}} must not have leading or trailing whitespace',
  // }),
  country: Joi.string().trim().required().messages({
    "string.empty": `"country" cannot be an empty field`,
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  concert_artist: Joi.boolean().optional(),
  bio: Joi.string().trim().allow("").optional().messages({
    "string.trim": "{{#label}} must not have leading or trailing whitespace",
  }),
  profile_img: Joi.string().allow("").optional(),
  profile_cover: Joi.string().allow("").optional(),
  genres: Joi.when("user_type", {
    is: Joi.string().valid("Fan"),
    then: Joi.array().items(Joi.string().trim()).optional(),
    otherwise: Joi.array()
      .items(Joi.string().trim())
      .min(1)
      .required()
      .messages({
        "string.base": `{{#label}} should be a type of string`,
        "string.empty": `{{#label}} cannot be an empty field`,
        "any.required": `{{#label}} is a required field`,
        "array.base": `{{#label}} should be an array`,
        "array.min": `{{#label}} should contain at least 1 item`,
        "object.base": `{{#label}} should be of type object`,
      }),
  }),
  facebook: Joi.string().regex(RegExp(urlRegex)).allow("").messages({
    "string.pattern.base": `"facebook" should be a type of 'URL'`,
    "string.empty": `"facebook" cannot be an empty field`,
  }),
  twitter: Joi.string().regex(RegExp(urlRegex)).allow("").messages({
    "string.pattern.base": `"twitter" should be a type of 'URL'`,
    "string.empty": `"twitter" cannot be an empty field`,
  }),
  // sportify: Joi.string().regex(RegExp(urlRegex)).allow('').messages({
  //     'string.pattern.base': `"sportify" should be a type of 'URL'`,
  //     'string.empty': `"sportify" cannot be an empty field`,
  // }),
  instagram: Joi.string().regex(RegExp(urlRegex)).allow("").messages({
    "string.pattern.base": `"instagram" should be a type of 'URL'`,
    "string.empty": `"instagram" cannot be an empty field`,
  }),
  youtube: Joi.string().regex(RegExp(urlRegex)).allow("").messages({
    "string.pattern.base": `"youtube" should be a type of 'URL'`,
    "string.empty": `"youtube" cannot be an empty field`,
  }),
  website: Joi.string().regex(RegExp(urlRegex)).allow("").messages({
    "string.pattern.base": `"website" should be a type of 'URL'`,
    "string.empty": `"website" cannot be an empty field`,
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

const validateappUserSpecificColumn = Joi.object({
  column: Joi.string()
    .required()
    .valid(
      "status",
      "verified",
      "profile_img",
      "profile_cover",
      "concert_artist"
    )
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

const validateRemoveProfileCoverImageReq = Joi.object({
  type: Joi.string()
    .valid("profile_cover", "profile_img")
    .trim()
    .required()
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

const validateAddRemoveBlockUserReq = Joi.object({
  user_id: Joi.string().required(),
});

const validateAddRemoveFollowUserUserReq = Joi.object({
  user_id: Joi.string().required(),
});

module.exports = {
  validateAddappUserReq,
  validateappUserSpecificColumn,
  validateUpdateappUserReq,
  validateLoginReq,
  validateVerificationCodeReq,
  validateForgotPasswordReq,
  validateResetPasswordReq,
  validateCheckUsernameReq,
  validateProfileCoverImageReq,
  validateRemoveProfileCoverImageReq,
  validatedeleteappUser,
  validateAddRemoveBlockUserReq,
  validateAddRemoveFollowUserUserReq,
};
