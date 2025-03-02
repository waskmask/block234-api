require("dotenv").config();
module.exports = {
  SWAGGER_DEFINATION: {
    info: {
      title: "Swagger API",
      version: "1.0.0",
      description: "Endpoints to test the APIs",
    },
    host: process.env.SWAGGER_HOST,
    basePath: "/",
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "authorization",
        scheme: "JWT",
        in: "header",
      },
    },
  },

  HOST: process.env.HOST,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY
};
