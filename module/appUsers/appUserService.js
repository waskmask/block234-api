const appUsersSchema = require("../../model/app_users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const { JWT_SECRET } = require("../../config");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const https = require("https");
require("dotenv").config();
const {
  getMessage,
  getForgotPasswordappUser,
  generateRandomToken,
  resizeImage,
  deleteFile,
} = require("../../utils/helper");
const transporter = nodemailer.createTransport({
  host: "smtp.ionos.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_FROM, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

const generateUniqueFileName = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8); // Generates a random string of length 6
  const uniqueFileName = `${timestamp}_${randomString}`;
  return uniqueFileName;
};

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

        // Prepare user data
        const userData = {
          username: shortid.generate().toLowerCase(),
          email,
          password: hashedPassword,
          full_name: req.body.full_name,
          city: req.body.city,
          country: req.body.country,
          dob: req.body.dob,
          gender: req.body.gender,
          crypto_exp: req.body.crypto_exp,
          verification: false,
          verification_token: verification_token,
          status: "Active",
          fake_email: false, // Default is false
        };

        // Send verification email
        const message = await getEmailVerification(email, verification_token);
        const messageData = await getMessage(
          message,
          email,
          process.env.EMAIL_FROM,
          "Vibrer Email Verification"
        );

        try {
          // Try sending the email
          await transporter.sendMail(messageData);
        } catch (emailError) {
          // Check if the error is due to an invalid email (550 - Mailbox Unavailable)
          if (
            emailError.code === "EENVELOPE" &&
            emailError.responseCode === 550 &&
            emailError.response.includes("mailbox unavailable")
          ) {
            userData.fake_email = true;
          }
        }

        // Create the user in the database
        const newUser = await appUsersSchema.create(userData);

        if (newUser) {
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
  const { token } = req.query;

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
  const { email, username, full_name, gender, dob, city, country, aboutUs } =
    req.body;

  try {
    const filter = { _id: payload.id };
    const existingUser = await appUsersSchema.findById(payload.id);
    if (!existingUser) {
      result.code = 2017;
      return result;
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
      username: username,
      full_name,
      gender,
      dob,
      city,
      country,
      aboutUs,
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
  const query = {};

  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
    query.$and.push({
      $or: [
        { full_name: searchRegex },
        { email: searchRegex },
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

const getappUserProfile = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const id = payload.id;

  try {
    const appUser = await appUsersSchema
      .findById(id)
      .select(
        "full_name _id email city country crypto_exp dob gender username aboutUs"
      );

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

const uploadProfileImage = async (req) => {
  const result = { data: null };
  const payload = req.decoded;

  if (!req.file) {
    result.code = 2029;
    return result;
  }

  const user = await appUsersSchema.findById(payload.id);
  if (!user) {
    result.code = 204;
    return result;
  }

  if (user.profileImage) {
    deleteFile(path.join(__dirname, "../../", user.profileImage));
  }

  const newPath = `/uploads/${new Date()
    .toLocaleString("en-us", { month: "2-digit", year: "numeric" })
    .replace("/", "-")}/images/${req.file.filename}`;

  await resizeImage(req.file.path, req.file.path); // Resize image unconditionally

  user.profileImage = newPath; // Save new path in database
  await user.save();

  result.data = { profileImage: newPath };
  result.code = 2030;

  return result;
};

const checkUsername = async (req) => {
  const result = { data: null };
  const { username } = req.params;
  const payload = req.decoded;

  try {
    const appUser = await appUsersSchema.findOne({
      username: username,
      _id: { $ne: payload.id },
    });

    if (appUser) {
      result.data = { is_exists: true };
      result.code = 205;
    } else {
      result.data = { is_exists: false };
      result.code = 2037;
    }
  } catch (error) {
    console.error("Error checking username:", error);
    result.code = 2028;
    result.error = error.message;
  }

  return result;
};

const removeProfileImage = async (req) => {
  const result = { data: null };
  const payload = req.decoded;
  const { type } = req.body;

  try {
    const user = await appUsersSchema.findById(payload.id);

    if (user.profileImage) {
      const imagePath = path.join(__dirname, "../../", user.profileImage);
      try {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      } catch (error) {
        console.error("Error deleting profile image:", error);
        result.code = 500;
        return result;
      }
      user.profileImage = null;
      await user.save();
      result.code = 203;
    }
  } catch (error) {
    console.error(`Error deleting ${type} image:`, error);
    result.code = 500;
  }

  return result;
};

module.exports = {
  updateappUserSpecificColumn,
  artistLogin,
  addappUser,
  updateappUser,
  getAllappUser,
  getappUser,
  forgotPassword,
  resetPassword,
  verificationCode,
  getappUserProfile,
  uploadProfileImage,
  checkUsername,
  removeProfileImage,
};
