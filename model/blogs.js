const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    caption: String,
  },
  { _id: false }
);

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    summary: {
      type: String,
      maxlength: 300,
      default: "",
    },
    featuredMedia: {
      type: new mongoose.Schema(
        {
          type: {
            type: String,
            enum: ["image", "video"],
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
        { _id: false }
      ),
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    embeddedMedia: [mediaSchema],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog_categories",
      },
    ],
    tags: [String],
    seo: {
      title: String,
      description: String,
      keywords: [String],
      canonicalUrl: String,
      ogImage: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);
