const Joi = require("joi");

const validateAddBlogReq = Joi.object({
  title: Joi.string().trim().max(150).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title must be at most 150 characters",
  }),

  slug: Joi.string().trim().lowercase().required().messages({
    "string.empty": "Slug is required",
  }),

  summary: Joi.string().max(300).allow(""),

  featuredMedia: Joi.object({
    type: Joi.string().valid("image", "video").required(),
    url: Joi.string().uri().required(),
  }).required(),

  content: Joi.string().required().messages({
    "string.empty": "Content is required",
  }),

  embeddedMedia: Joi.array().items(
    Joi.object({
      type: Joi.string().valid("image", "video").required(),
      url: Joi.string().uri().required(),
      caption: Joi.string().allow(""),
    })
  ),

  categories: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one category is required",
      "any.required": "Categories are required",
    }),

  tags: Joi.array().items(Joi.string()),

  seo: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()).required(),
    canonicalUrl: Joi.string().uri().allow(""),
    ogImage: Joi.string().uri().allow(""),
  })
    .required()
    .messages({
      "any.required": "SEO details are required",
    }),

  isPublished: Joi.boolean(),

  publishedAt: Joi.date().optional(),
});
const validateUpdateBlogReq = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "ID must be a valid 24-character ObjectId",
      "any.required": "ID is required",
    }),

  title: Joi.string().trim().max(150).messages({
    "string.empty": "Title is required",
    "string.max": "Title must be at most 150 characters",
  }),

  slug: Joi.string().trim().lowercase().messages({
    "string.empty": "Slug is required",
  }),

  summary: Joi.string().max(300).allow(""),

  featuredMedia: Joi.object({
    type: Joi.string().valid("image", "video"),
    url: Joi.string().uri(),
  }),

  content: Joi.string().messages({
    "string.empty": "Content is required",
  }),

  embeddedMedia: Joi.array().items(
    Joi.object({
      type: Joi.string().valid("image", "video"),
      url: Joi.string().uri(),
      caption: Joi.string().allow(""),
    })
  ),

  categories: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one category is required",
      "any.required": "Categories are required",
      "string.hex": "Each category must be a valid ObjectId",
      "string.length": "Each category must be a 24-character ObjectId",
    }),

  tags: Joi.array().items(Joi.string()),

  seo: Joi.object({
    title: Joi.string().allow(""),
    description: Joi.string().allow(""),
    keywords: Joi.array().items(Joi.string()),
    canonicalUrl: Joi.string().uri().allow(""),
    ogImage: Joi.string().uri().allow(""),
  })
    .required()
    .messages({
      "any.required": "SEO details are required",
    }),

  isPublished: Joi.boolean(),

  publishedAt: Joi.date(),
});

const validateUploadMediaReq = Joi.object({
  type: Joi.string().valid("image", "video").required().messages({
    "any.only": `"type" must be either 'image' or 'video'`,
    "string.empty": `"type" cannot be an empty field`,
  }),
});

module.exports = {
  validateAddBlogReq,
  validateUpdateBlogReq,
  validateUploadMediaReq,
};
