const message = {
  200: {
    message: "Data Show Successfully",
    httpCode: 200,
    status: 1,
  },
  201: {
    message: "Record Created Successfully",
    httpCode: 201,
    status: 1,
  },
  202: {
    message: "Record Updated Successfully",
    httpCode: 201,
    status: 1,
  },
  203: {
    message: "Record deleted Successfully",
    httpCode: 201,
    status: 1,
  },
  204: {
    message: "No record found",
    httpCode: 200,
    status: 0,
  },
  205: {
    message: "Record already exists",
    httpCode: 200,
    status: 0,
  },
  206: {
    message: "Record does not exists",
    httpCode: 200,
    status: 0,
  },
  400: {
    message: "Bad Request",
    httpCode: 400,
    status: 0,
  },
  401: {
    message: "You are not authorized to perform this action.",
    httpCode: 401,
    status: 0,
  },
  500: {
    message: "Error occured while processing request, please try again later",
    httpCode: 200,
    status: 0,
  },
  2015: {
    message: "Reset password successfully",
    httpCode: 200,
    status: 1,
  },
  2016: {
    message: "Password and confirm password did not match",
    httpCode: 400,
    status: 0,
  },
  2017: {
    message: "User not found",
    httpCode: 400,
    status: 0,
  },
  2018: {
    message: "Token is expired",
    httpCode: 400,
    status: 0,
  },
  2019: {
    message: "Invalid email and/or password",
    httpCode: 400,
    status: 0,
  },
  2021: {
    message: "Login Successfull",
    httpCode: 200,
    status: 1,
  },
  2022: {
    message: "Invalid OR Expired Token",
    httpCode: 200,
    status: 0,
  },
  2023: {
    message: "Your account has been verified successfully",
    httpCode: 200,
    status: 1,
  },
  2024: {
    message: "Reset password link has been sent to your E-mail",
    httpCode: 200,
    status: 1,
  },
  2025: {
    message: "Something went wrong while sending E-mail",
    httpCode: 400,
    status: 0,
  },
  2028: {
    message: "Something went wrong please try again later",
    httpCode: 400,
    status: 0,
  },
  2029: {
    message: "File is required",
    httpCode: 400,
    status: 0,
  },
  2030: {
    message: "File uploaded successfully",
    httpCode: 200,
    status: 1,
  },
  2037: {
    message: "Username is available",
    httpCode: 200,
    status: 1,
  },
  2038: {
    message: "Username already exists",
    httpCode: 400,
    status: 0,
  },

  2043: {
    message: "Admin details not found",
    httpCode: 400,
    status: 0,
  },
  2044: {
    message: "Account already deleted",
    httpCode: 200,
    status: 0,
  },

  2045: {
    message: "Invalid Coin ID",
    httpCode: 400,
    status: 0,
  },
  2046: {
    message: "Coin Already Saved",
    httpCode: 400,
    status: 0,
  },
  2047: {
    message: "One or more categories are invalid",
    httpCode: 400,
    status: 0,
  },
  2048: {
    message: "Invalid Slug format",
    httpCode: 400,
    status: 0,
  },
};

module.exports = message;
