const blogCategoriesSchema = require("../../model/blog_categories");

const addblogCategory = async (req) => {
  const result = { data: null };
  const { name, status } = req.body;
  const categoryCheck = await blogCategoriesSchema.findOne({ name: name });
  if (categoryCheck) {
    result.code = 205;
    return result; // Return immediately if category already exists
  } else {
    const blog = await blogCategoriesSchema.create({
      name: name,
      status: status,
    });
    if (blog) {
      result.data = blog;
      result.code = 201;
    } else {
      result.code = 204;
    }
    return result;
  }
};

const updateblogCategory = async (req) => {
  const result = { data: null };
  const { id, name, status } = req.body;
  const filter = { _id: id };
  const categoryCheck = await blogCategoriesSchema.findOne({
    name: name,
    _id: { $ne: id },
  });
  if (categoryCheck) {
    result.code = 205;
  } else {
    const blog = await blogCategoriesSchema.updateOne(
      filter,
      {
        name: name,
        status: status,
      },
      {
        where: {
          _id: id,
        },
      }
    );
    if (blog) {
      result.data = blog;
      result.code = 202;
    } else {
      result.code = 204;
    }
  }
  return result;
};

const getAllblogCategory = async (req) => {
  const result = { data: null };
  const blog = await blogCategoriesSchema.find().sort({ createdAt: -1 });
  if (blog) {
    result.data = blog;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
};

const getblogCategory = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  try {
    const blog = await blogCategoriesSchema.findById(id);
    if (blog) {
      result.data = blog;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 204;
  }
  return result;
};

const deleteblogCategory = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const blog = await blogCategoriesSchema.findByIdAndRemove(id);
  if (blog) {
    result.data = blog;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
};

module.exports = {
  addblogCategory,
  updateblogCategory,
  getAllblogCategory,
  getblogCategory,
  deleteblogCategory,
};
