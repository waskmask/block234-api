const blogSchema = require("../../model/blogs");
const appUsersSchema = require("../../model/app_users");
const categoryShema = require("../../model/blog_categories");
const path = require("path");
const fs = require("fs");
const { BACKEND_URL } = require("../../config/index");

const addBlog = async (req) => {
  const result = { data: null };
  const payload = req.decoded; // Assuming this contains user info (e.g., id)

  const {
    title,
    slug,
    summary,
    content,
    featuredMedia,
    embeddedMedia,
    categories,
    tags,
    seo,
    isPublished,
    publishedAt,
  } = req.body;

  // Check for duplicate slug
  const existing = await blogSchema.findOne({ slug });
  if (existing) {
    result.code = 205; // Conflict
    return result;
  }

  try {
    const blog = await blogSchema.create({
      title,
      slug,
      summary,
      content,
      featuredMedia,
      embeddedMedia,
      categories,
      tags,
      seo,
      isPublished,
      publishedAt: isPublished ? publishedAt || new Date() : null,
      author: payload.id,
      createdBy: payload.id,
      updatedBy: payload.id,
    });

    result.data = blog;
    result.code = 201; // Created
  } catch (err) {
    console.error("Error creating blog post:", err);
    result.code = 500; // Internal server error
    result.message = "Something went wrong while creating the blog post.";
  }

  return result;
};

const updateblog = async (req) => {
  const payload = req.decoded;
  const result = { data: null };
  const {
    id,
    title,
    slug,
    summary,
    featuredMedia,
    content,
    embeddedMedia,
    categories,
    tags,
    seo,
    isPublished,
    publishedAt,
  } = req.body;

  try {
    // Find the blog by ID
    const blog = await blogSchema.findOne({ _id: id });

    if (!blog) {
      result.code = 204;
      return result;
    }

    // Check for duplicate slug (if provided)
    if (slug && slug !== blog.slug) {
      const blogWithSameSlug = await blogSchema.findOne({
        _id: { $ne: id },
        slug,
      });
      if (blogWithSameSlug) {
        result.code = 205; // Conflict due to duplicate slug
        return result;
      }
    }

    // Validate categories (if provided)
    if (categories) {
      const validCategories = await categoryShema.find({
        _id: { $in: categories },
      });
      if (validCategories.length !== categories.length) {
        result.code = 2047;
        result.message = "One or more categories are invalid";
        return result;
      }
    }

    // Update blog fields (only if provided)
    if (title !== undefined) blog.title = title;
    if (slug !== undefined) blog.slug = slug;
    if (summary !== undefined) blog.summary = summary;
    if (featuredMedia !== undefined) blog.featuredMedia = featuredMedia;
    if (content !== undefined) blog.content = content;
    if (embeddedMedia !== undefined) blog.embeddedMedia = embeddedMedia;
    if (categories !== undefined) blog.categories = categories;
    if (tags !== undefined) blog.tags = tags;
    if (seo !== undefined) blog.seo = seo;
    if (isPublished !== undefined) blog.isPublished = isPublished;
    if (publishedAt !== undefined) blog.publishedAt = publishedAt;

    // Set metadata
    blog.updatedBy = payload.id;
    blog.updatedAt = new Date();

    // Save the updated blog
    const updatedBlog = await blog.save();

    if (updatedBlog) {
      result.data = updatedBlog;
      result.code = 202; // Successful update
      result.message = "Blog updated successfully";
    } else {
      result.code = 500; // Update failed
      result.message = "Failed to update blog";
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    result.code = 500; // Internal server error
    result.message = "Internal server error";
  }

  return result;
};

const getAllblog = async (req) => {
  const result = { data: null };

  try {
    const query = {};

    // Optional category name filter
    if (
      req.body.categories &&
      Array.isArray(req.body.categories) &&
      req.body.categories.length > 0
    ) {
      const categoryNames = req.body.categories.map((name) => name.trim());

      // Find matching category documents
      const categories = await categoryShema.find({
        name: { $in: categoryNames },
      });

      if (categories.length === 0) {
        result.code = 204;
        result.message = "No matching categories found";
        return result;
      }

      const categoryIds = categories.map((cat) => cat._id);

      query.categories = { $in: categoryIds };
    }

    // Fetch blogs with optional category filter
    const blogs = await blogSchema
      .find(query)
      .populate("categories", "name slug")
      .lean();

    if (blogs.length > 0) {
      result.data = blogs;
      result.code = 200;
    } else {
      result.code = 204;
      result.message = "No blogs found";
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    result.code = 500;
    result.message = "Internal server error";
  }

  return result;
};

const getblog = async (req) => {
  const result = { data: null };

  const slug = req.params.slug;

  // Basic slug validation
  const slugRegex = /^[a-z0-9-]+$/;

  if (!slug || typeof slug !== "string" || !slugRegex.test(slug)) {
    result.code = 2048;
    return result;
  }

  try {
    const blogDetails = await blogSchema
      .findOne({ slug })
      .populate("categories", "name slug")
      .lean();

    if (blogDetails) {
      result.data = blogDetails;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
    result.code = 500;
  }

  return result;
};

const deleteblog = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const blog = await blogSchema.findByIdAndRemove(id);
  if (blog) {
    result.data = blog;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
};

const uploadMedia = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  // Check for missing file or type
  if (!req.file || !req.body.type) {
    result.code = 400;
    result.message = "Missing required file or type.";
    return result;
  }

  const { type } = req.body;
  const mimeType = req.file.mimetype;

  // Define valid MIME types
  const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  // Validate type and MIME type
  let isValid = false;
  if (type === "video" && validVideoTypes.includes(mimeType)) {
    isValid = true;
  } else if (type === "image" && validImageTypes.includes(mimeType)) {
    isValid = true;
  }

  if (!isValid) {
    // Delete the uploaded file if invalid
    if (req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete invalid file:", err);
      });
    }
    result.code = 415;
    result.message = "Invalid media type or mismatched file.";
    return result;
  }

  // Get the month-year folder (e.g., "05-2025")
  const monthYear = new Date()
    .toLocaleString("en-us", { month: "2-digit", year: "numeric" })
    .replace("/", "-");

  // Determine the subfolder based on file type
  const subFolder = type === "video" ? "videos" : "images";

  // Construct the final file path (relative to Uploads)
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const baseFileName = path.basename(req.file.originalname, originalExt);
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const outputFileName = `${uniqueSuffix}-${baseFileName}${originalExt}`;
  const outputPath = path.join(
    __dirname,
    `../../uploads/${monthYear}/${subFolder}/${outputFileName}`
  );

  // Ensure the destination directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Rename/move the file to the final location
  try {
    fs.renameSync(req.file.path, outputPath);
  } catch (error) {
    console.error("Failed to rename file:", error);
    result.code = 500;
    result.message = "Failed to process uploaded file.";
    return result;
  }

  // Construct the relative path for the response (e.g., for serving the file)
  const relativeFilePath = path
    .join("uploads", monthYear, subFolder, outputFileName)
    .replace(/\\/g, "/");

  result.data = {
    title: req.body.title,
    type,
    media: BACKEND_URL + relativeFilePath, // Store relative path for easier serving
    uploadedBy: payload.id,
  };
  result.code = 201;

  return result;
};

module.exports = {
  addBlog,
  updateblog,
  getAllblog,
  getblog,
  deleteblog,
  uploadMedia,
};
