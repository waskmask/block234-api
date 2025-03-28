const appUsersSchema = require("../../model/app_users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const nodemailer = require("nodemailer");
const sharp = require("sharp");
const heicConvert = require("heic-convert");
const path = require("path");
const fs = require("fs");
const https = require("https");
const AWS = require("aws-sdk");
const exceljs = require("exceljs");
require("dotenv").config();
const {
  getMessage,
  getForgotPassword,
  generateRandomToken,
  isValidEmail,
} = require("../../utils/helper");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const transporter = nodemailer.createTransport({
  host: "smtp.ionos.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_FROM, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        email = email.toLowerCase();
        const existingUser = await appUsersSchema.findOne({ email });

        if (existingUser) {
          return done(null, false, { message: "Email is already taken." });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const verification_token = generateRandomToken(50);

        const newUser = await appUsersSchema.create({
          email,
          password: hashedPassword,
          // name: {
          full_name: req.body.full_name,
          // last_name: req.body.last_name,
          // },
          city: req.body.city,
          country: req.body.country,
          crypto_exp: req.body.crypto_exp,
          verification: false,
          verification_token: verification_token,
          status: "Active",
        });
        if (newUser) {
          const message = await getEmailVerification(email, verification_token);
          const messageData = await getMessage(
            message,
            email,
            process.env.EMAIL_FROM,
            "Vibrer Email Verification"
          );

          // Assuming you have a function to send the verification email
          const send = await transporter.sendMail(messageData);

          return done(null, newUser);
        } else {
          return done(null, false, { message: "User registration failed." });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "local-login-artist",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        email = email.toLowerCase();
        const user = await appUsersSchema.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }
        // if (!user.verification) {
        //   return done(null, false, { message: "Invalid email or password" });
        // }
        const match = await bcryptjs.compareSync(password, user.password);

        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid email or password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await appUsersSchema.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const artistLogin = async (req) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local-login-artist", (err, user, info) => {
      let result = { data: null };

      if (err) {
        reject(err);
      } else if (!user) {
        result.code = 2019; // Invalid email or password
        resolve(result);
      } else {
        let payload = {
          id: user.id,
          mobile: user.email,
          role: user.role,
        };

        let options = { expiresIn: "72h" };
        let token = jwt.sign(payload, JWT_SECRET, options);

        let resObj = {
          role: user.role,
          email: user.email,
          token,
        };

        result.data = resObj;
        result.code = 2021;
        resolve(result);
      }
    })(req);
  });
};

const forgotPassword = async (req) => {
  let result = { data: null };
  const { email } = req.body;
  const verification_token = generateRandomToken(50);
  const message = await getForgotPasswordappUser(email, verification_token);
  const messageData = await getMessage(
    message,
    email,
    process.env.EMAIL_FROM,
    "Forgot Password"
  );

  try {
    const admin = await appUsersSchema.findOne({ email: email });

    if (admin) {
      try {
        // await sendGridMail.send(messageData);
        const send = await transporter.sendMail(messageData);
        if (send) {
          const expiryDate = new Date(Date.now() + 3600000); // Set the expiry to one hour from now
          admin.forgotPasswordToken = {
            token: verification_token,
            expiresAt: expiryDate,
          };
          await admin.save();
          result.code = 2024;
        } else {
          result.code = 2025;
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
        result.code = 2025;
      }
    } else {
      result.code = 2017;
    }
  } catch (error) {
    // Handle the error appropriately
    console.error("Error occurred:", error);
    result.code = 2017;
  }
  return result;
};

const resetPassword = async (req) => {
  let result = { data: null };
  const { token, confirmPassword } = req.body;

  if (req.body.password !== confirmPassword) {
    result.code = 2016;
    return result;
  }

  const password = await bcryptjs.hashSync(req.body.password, 10);

  try {
    const admin = await appUsersSchema.findOne({
      "forgotPasswordToken.token": token,
    });

    if (admin) {
      const currentTimestamp = new Date();
      if (admin.forgotPasswordToken.expiresAt < currentTimestamp) {
        result.code = 2018; // Token has expired
      } else {
        const reset = await appUsersSchema.updateOne(
          { "forgotPasswordToken.token": token },
          {
            $set: { password: password },
            $unset: { forgotPasswordToken: 1 },
          }
        );

        result.data = reset;
        result.code = 2015; // Password reset success
      }
    } else {
      result.code = 2017; // Invalid token
    }
  } catch (error) {
    console.error("Error:", error);
    result.code = 500; // Handle error cases appropriately
  }

  return result;
};

const verificationCode = async (req) => {
  let result = { data: null };
  const { token } = req.body;

  try {
    const adminUser = await appUsersSchema.findOne({
      verification_token: token,
      verification: false,
    });
    if (adminUser) {
      const updateToken = await appUsersSchema.updateOne(
        { _id: adminUser._id },
        { $set: { verification: true } }
      );

      if (updateToken) {
        result.code = 2023;
      } else {
        result.code = 500;
      }
    } else {
      result.code = 2022;
    }
  } catch (error) {
    console.error("Error checking verification code:", error);
    result.code = 500;
  }

  return result;
};

const updateappUserSpecificColumn = async (req) => {
  const result = { data: null };
  const { id, column, value } = req.body;

  try {
    const appUser = await appUsersSchema.findById(id);

    if (appUser) {
      // Use an object to specify the field you want to update dynamically
      const updateObject = {};
      updateObject[column] = value;

      // Update the specified field
      const reset = await appUsersSchema.updateOne({ _id: id }, updateObject);
      if (reset) {
        result.data = reset;
        result.code = 202;
      } else {
        result.code = 400;
      }
    } else {
      result.code = 2017;
    }
  } catch (error) {
    result.code = 400;
    result.error = error;
  }

  return result;
};

const addappUser = async (req) => {
  return new Promise((resolve, reject) => {
    const result = { data: null };
    passport.authenticate("local-signup", async (err, user, info) => {
      if (err) {
        throw err;
      }
      if (!user) {
        result.code = 205; // Email is already taken
        resolve(result);
      } else {
        // Registration successful
        result.data = user;
        result.code = 201;
        resolve(result);
      }
    })(req);
  });
};

const updateappUser = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const {
    email,
    username,
    artist_categories,
    first_name,
    last_name,
    full_name,
    gender,
    date_of_birth,
    city,
    country,
    concert_artist,
    visibility,
    bio,
    profile_img,
    profile_cover,
    genres,
    facebook,
    twitter,
    instagram,
    youtube,
    website,
  } = req.body;

  try {
    const filter = { _id: payload.id };
    const existingUser = await appUsersSchema.findById(payload.id);
    let updatedUsername;

    if (!existingUser.username && !req.body.username) {
      if (req.body.first_name && req.body.last_name) {
        updatedUsername = await new UniqueUsernameGenerator().generateUsername(
          req.body.first_name,
          req.body.last_name
        );
      } else if (req.body.full_name) {
        updatedUsername =
          await new UniqueUsernameGenerator().generateUsernameByFullName(
            req.body.full_name
          );
      }
    } else {
      updatedUsername = req.body.username || existingUser.username;
    }

    if (req.body.username) {
      const existingUsernameOther = await appUsersSchema.findOne({
        username: req.body.username,
        _id: { $ne: payload.id },
      });
      if (existingUsernameOther) {
        result.code = 2038;
        return result;
      }
    }

    const update = {
      email,
      username: updatedUsername.toLowerCase(),
      artist_categories,
      name: {
        first_name,
        last_name,
      },
      full_name,
      gender,
      date_of_birth,
      city,
      country,
      concert_artist,
      visibility,
      bio,
      profile_img,
      profile_cover,
      genres,
      link: {
        facebook,
        twitter,
        instagram,
        youtube,
        website,
      },
    };

    const updatedUser = await appUsersSchema.updateOne(filter, update);

    if (updatedUser) {
      // if(req.)
      // const uploadProfileImage = uploadProfileCoverImage();
      // const uploadProfileImage = uploadProfileCoverImage();
      result.data = updatedUser;
      result.code = 202;
    } else {
      result.code = 2017;
    }
  } catch (error) {
    console.error("Error updating user:", error);
    result.code = 500;
  }

  return result;
};

const getAllappUser = async (req) => {
  const result = { data: null };
  let { page, limit, search, draw } = req.query;

  // Set default values if page or limit is not provided
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  // Construct your query based on search parameters
  const query = {
    $and: [
      {
        $or: [
          { "account_deleted.is_deleted": { $ne: true } },
          { account_deleted: { $exists: false } },
        ],
      },
    ],
  };

  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
    query.$and.push({
      $or: [
        { full_name: searchRegex },
        { email: searchRegex },
        { user_type: searchRegex },
        { country: searchRegex },
        // Add more fields for search as needed
      ],
    });
  }

  const totalDocuments = await appUsersSchema.countDocuments(query);
  const totalPages = Math.ceil(totalDocuments / limit);

  // Ensure page is within valid range
  page = Math.min(page, totalPages);
  page = Math.max(page, 1); // Ensure page is at least 1

  // Fetch appUsers based on query, skipping appropriate number of documents based on pagination
  const skipValue = (page - 1) * limit; // Calculate skip value
  const appUser = await appUsersSchema
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skipValue >= 0 ? skipValue : 0) // Ensure skip value is non-negative
    .limit(limit);

  if (appUser) {
    // Prepare the response data
    result.code = 200;
    result.data = {
      draw,
      data: appUser,
      page,
      limit,
      recordsFiltered: totalDocuments,
      recordsTotal: totalDocuments, // totalRecords is the same as recordsTotal in DataTables
    };
  } else {
    result.code = 204; // No Content
  }

  return result;
};

const getappUser = async (req) => {
  const result = { data: null };
  const id = req.params.id;

  try {
    const appUser = await appUsersSchema.findById(id);
    let artistCategoriesInfo = await artistCategoriesSchema.find({
      _id: { $in: appUser.artist_categories },
    });
    if (artistCategoriesInfo) {
      appUser.artist_categories = artistCategoriesInfo;
    }
    let genresInfo = await genreSchema.find({
      _id: { $in: appUser.genres },
    });
    if (genresInfo) {
      appUser.genres = genresInfo;
    }

    if (appUser) {
      result.data = appUser;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 204;
    result.error = error;
  }

  return result;
};

const getAllappArtists = async (req) => {
  const result = { data: null };

  try {
    // Fetch all app users
    const appUsers = await appUsersSchema.find(
      {
        $and: [
          { concert_artist: true }, // Must be a concert artist
          {
            $or: [
              { "account_deleted.is_deleted": { $ne: true } }, // Not deleted
              { account_deleted: { $exists: false } }, // `account_deleted` field does not exist
            ],
          },
        ],
      },
      {
        link: 1,
        _id: 1,
        email: 1,
        artist_categories: 1,
        visibility: 1,
        verification: 1,
        genres: 1,
        status: 1,
        profile_img: 1,
        profile_cover: 1,
        bio: 1,
        city: 1,
        country: 1,
        date_of_birth: 1,
        full_name: 1,
        gender: 1,
        username: 1,
        concert_artist: 1,
      }
    );

    if (!appUsers || appUsers.length === 0) {
      result.code = 204; // No content
      return result;
    }

    // Collect all unique category and genre IDs
    const artistCategoryIds = [
      ...new Set(appUsers.flatMap((user) => user.artist_categories || [])),
    ];
    const genreIds = [
      ...new Set(appUsers.flatMap((user) => user.genres || [])),
    ];

    // Fetch artist categories and genres in bulk
    const artistCategoriesInfo = await artistCategoriesSchema.find({
      _id: { $in: artistCategoryIds },
    });
    const genresInfo = await genreSchema.find({
      _id: { $in: genreIds },
    });

    // Map categories and genres by their IDs for faster lookup
    const artistCategoriesMap = Object.fromEntries(
      artistCategoriesInfo.map((cat) => [cat._id.toString(), cat])
    );
    const genresMap = Object.fromEntries(
      genresInfo.map((genre) => [genre._id.toString(), genre])
    );

    // Populate each user's categories and genres
    const populatedUsers = appUsers.map((user) => ({
      ...user.toObject(), // Convert Mongoose document to plain object
      artist_categories: (user.artist_categories || []).map(
        (id) => artistCategoriesMap[id.toString()]
      ),
      genres: (user.genres || []).map((id) => genresMap[id.toString()]),
    }));

    result.data = populatedUsers;
    result.code = 200; // Success
  } catch (error) {
    result.code = 500; // Internal server error
    result.error = error.message || "An error occurred";
  }

  return result;
};

const getappUserProfile = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const id = payload.id;

  try {
    const appUser = await appUsersSchema
      .findById(id)
      .select("full_name _id email city country", "crypto_exp");

    if (appUser) {
      result.data = appUser;
      result.code = 200;
    } else {
      result.code = 204;
    }
  } catch (error) {
    result.code = 204;
    result.error = error;
  }

  return result;
};

const deleteappUser = async (req) => {
  const result = { data: null };
  const { user_id, user_type } = req.body;

  try {
    const user = await appUsersSchema.findById(user_id);
    if (user && user.account_deleted && user.account_deleted.is_deleted) {
      result.code = 2044;
      return result;
    }

    let accountDeleted = null;
    if (user_type === "admin") {
      const adminData = await adminUsersSchema.findById(req.decoded.id);
      if (!adminData) {
        result.code = 2043;
        return result;
      }
      const admin_email = adminData.email;
      const admin_name = `${adminData.name.first_name} ${adminData.name.last_name}`;
      accountDeleted = {
        is_deleted: true,
        deleted_by: {
          user_type: "admin",
          admin_email: admin_email,
          admin_name: admin_name,
        },
        deletedAt: new Date(),
      };
    } else {
      accountDeleted = {
        is_deleted: true,
        deleted_by: {
          user_type: "self",
        },
        deletedAt: new Date(),
      };
    }

    const updatedUser = await appUsersSchema.findOneAndUpdate(
      { _id: user_id },
      {
        $unset: {
          email: "",
          password: "",
          username: "",
          artist_categories: "",
          name: "",
          gender: "",
          date_of_birth: "",
          city: "",
          country: "",
          concert_artist: "",
          visibility: "",
          bio: "",
          profile_img: "",
          profile_cover: "",
          verified: "",
          verification: "",
          verification_token: "",
          forgotPasswordToken: "",
          genres: "",
          gallery: "",
          link: "",
          favourites: "",
          status: "",
        },
        $set: {
          account_deleted: accountDeleted,
          full_name: "user_deleted",
        },
      },
      {
        new: true,
        select: {
          _id: 1,
          user_type: 1,
          full_name: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );

    if (updatedUser) {
      await contestSchema.updateMany(
        { "participates.user_id": user_id },
        {
          $pull: {
            participates: { user_id: user_id },
          },
        }
      );

      await contestSchema.updateMany(
        { "participates.votes.user_id": user_id },
        {
          $pull: {
            "participates.$[].votes": { user_id: user_id },
          },
        }
      );
      result.data = updatedUser;
      result.code = 203;
    } else {
      result.code = 204;
    }
  } catch (error) {
    console.error("Error while deleting appUser:", error);
    result.code = 500;
  }

  return result;
};

module.exports = {
  artistLogin,
  updateappUserSpecificColumn,
  addappUser,
  updateappUser,
  getAllappUser,
  getappUser,
  deleteappUser,
  forgotPassword,
  resetPassword,
  verificationCode,
  getappUserProfile,
  getAllappArtists,
};
