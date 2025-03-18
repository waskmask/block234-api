const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const stream = require("stream");
const Coin = require("../model/coin");
const TopCoin = require("../model/topCoin");
const CoinsHistory = require("../model/CoinsHistory");
const CoinMaster = require("../model/CoinMaster");
const moment = require("moment-timezone");

const cron = require("node-cron");
const axios = require("axios");

const { COINMARKETCAP_API_KEY } = require("../config/index");
require("dotenv").config();

async function fetchCryptoData() {
  console.log("🔄 Fetching ranked crypto data from CoinMaster...");

  try {
    // Step 1: Fetch coins from CoinMaster sorted by rank
    const coinMasterList = await CoinMaster.find().sort({ rank: 1 }).lean();
    const symbols = coinMasterList.map((coin) => coin.symbol);

    console.log(`🔄 Fetching data for ${symbols.length} coins...`);

    // Step 2: Fetch only these coins from CoinMarketCap
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      {
        headers: { "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY },
        params: {
          symbol: symbols.join(","), // Pass symbols directly
          convert: "USD",
        },
      }
    );

    // Step 3: Map API response directly & maintain rank order
    const coinDataMap = Object.values(response.data.data).reduce(
      (acc, coin) => {
        const currentPrice = coin.quote.USD.price; // Extract price

        if (currentPrice !== null) {
          acc[coin.symbol] = {
            id: coin.id.toString(),
            symbol: coin.symbol,
            name: coin.name,
            image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
            current_price: currentPrice,
            price_change_percentage_24h: coin.quote.USD.percent_change_24h,
            market_cap: coin.quote.USD.market_cap,
            updated_at: moment().tz("Asia/Kolkata").toDate(),
          };
        }
        return acc;
      },
      {}
    );

    // Step 4: Maintain rank order from CoinMaster & remove null prices
    const sortedCoins = coinMasterList
      .map((coin) => ({
        ...coinDataMap[coin.symbol],
        rank: coin.rank, // Maintain original rank
        image: coin.imageUrl,
      }))
      .filter((coin) => coin.id && coin.current_price !== null); // Ensure valid coins & price is not null

    console.log(`✅ Fetched ${sortedCoins.length} valid coins`);

    // Step 5: Update the Coins collection
    await Coin.deleteMany({});
    await Coin.insertMany(sortedCoins);
    console.log("✅ All crypto data updated successfully!");

    // Step 6: Select top 10 coins by market cap
    let top10Coins = sortedCoins
      .sort((a, b) => b.market_cap - a.market_cap)
      .slice(0, 10);

    // Step 7: Select next top 10 coins by price_change_percentage_24h (excluding top 10 by market cap)
    let top10ExcludedSymbols = new Set(top10Coins.map((coin) => coin.symbol));
    let top10Gainers = sortedCoins
      .filter(
        (coin) =>
          !top10ExcludedSymbols.has(coin.symbol) && coin.current_price !== null
      ) // Exclude top 10 by market cap & null prices
      .sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      )
      .slice(0, 10);

    // Step 8: Update the TopCoins collection
    await TopCoin.deleteMany({});
    await TopCoin.insertMany([...top10Coins, ...top10Gainers]); // Save top market cap + top gainers
    console.log(
      "✅ Top 10 market cap and top 10 gainers updated successfully!"
    );
  } catch (error) {
    console.error("❌ Error fetching crypto data:", error.message);
  }
}

async function saveDailyCryptoSnapshot() {
  console.log("🔄 Saving daily snapshot of all crypto data...");

  try {
    const coins = await Coin.find({}); // Get all current coins

    if (coins.length === 0) {
      console.log("⚠ No coins found. Skipping history save.");
      return;
    }

    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD"); // Format: YYYY-MM-DD

    // Upsert (update or insert) to ensure only one document per date
    await CoinsHistory.updateOne(
      { date: today }, // Search by date
      {
        $set: { date: today, coins: coins },
      },
      { upsert: true } // Insert if not exists
    );

    console.log(
      `✅ Successfully saved ${coins.length} coins to history for ${today}`
    );
  } catch (error) {
    console.error("❌ Error saving daily crypto snapshot:", error.message);
  }
}

// Run once when the app starts
// fetchCryptoData();
// saveDailyCryptoSnapshot();

cron.schedule("59 23 * * *", async () => {
  console.log("⏰ Running daily crypto snapshot...");
  await saveDailyCryptoSnapshot();
});

// // Run every 15 minutes
cron.schedule("*/30 * * * *", fetchCryptoData);

send = (res, code, data, msg = "", customMsg = "", totalRecords) => {
  let result = {};
  const m = require("./msgs")[code];
  result.status = m ? m.status : code;
  result.message = msg ? msg : m ? m.message : "";
  result.message = customMsg
    ? customMsg + " " + result.message
    : result.message;
  result.result = data;
  if (totalRecords) result.totalRecords = totalRecords;
  res.status(m ? m.httpCode : code).json(result);
};

generateRandomToken = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    token += characters.charAt(randomIndex);
  }

  return token;
};

getEmailVerification = (email, verification_token) => {
  let data =
    `<!DOCTYPE html>
  <html lang="en" style="margin: 0; padding: 0; overflow-x: hidden; box-sizing: border-box;">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>E-MAIL VERIFICATION</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway:500,700&display=swap" rel="stylesheet">
  </head>
  
  <body style="margin: 0; padding: 0; overflow-x: hidden; box-sizing: border-box; background-color: #444;">
    <section class="container" style="display: grid; justify-content: center;">
      <div class="template-wrapper" style="background-color: #fff; width: 100%;">
        <!--div class="row" style="width: 100%; display: flex;">
          <div class="text-center col logo" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; background: #f4f4f4; border: solid 1px #e4e4e4; padding: 30px 10px;">
            <img src="https://vibrer.cloud/public/images/viberer-logo-light.svg" alt="Hello Worker Logo" style="width: 200px;">
          </div>
        </div-->
        <div class="row" style="width: 100%; display: flex;">
          <div class="col text-center resPW" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; background-color: #ff5d5d; padding: 30px 10px;">
            <h1 style="font-family: sans-serif; color: #ffffff; font-weight: 700; font-size: 1rem; margin: 0; text-transform: uppercase;">
            E-MAIL VERIFICATION
            </h1>
          </div>
        </div>
        <div class="row" style="width: 100%; display: flex;">
          <div class="col content" style="width: 100%; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 15px;">
            <h3 style="margin: 0; font-family: sans-serif; font-size: 1.1rem; color: #3f3d56; margin-bottom: 8px;">
            Dear ` +
    email +
    `</h3>
            <p style="margin: 0; font-family: sans-serif; line-height: 1.5; color: #ff5d5d; font-size: 1.3rem;">
            you have successfully registered
            </p>
          </div>
        </div>
        
  
        <div class="row" style="width: 100%; display: flex;">
          <div class="col content" style="width: 100%; padding-left: 30px; padding-right: 30px; padding-top: 15px; padding-bottom: 30px;">
  
            <p style="margin: 0; font-size: 15px; color: #3f3d56; font-family: sans-serif; line-height: 2;">
            To verify your email <a style="color: #0369ee;" href="https://vibrer.cloud/email-verification?token=` +
    verification_token +
    `">Click
            Here</a><br>
            Thank you for using the Vibrer.
            </p>
          </div>
        </div>
        <div class="row" style="width: 100%; display: flex;">
          <div class="col footer text-center" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; padding: 30px 10px; background-color: #3f3d56; margin-top: 15px;">
            <p style="margin: 0; font-family: sans-serif; line-height: 1.5; color: #e9e8e8; font-size: 14px;">©
            © 2024 All rights reserved | Vibrer Internet Content Provider L.L.C, UAE</p>
          </div>
        </div>
      </div>
    </section>
  </body>
  
  </html>`;

  return data;
};

getEmailVerificationappUser = (email, verification_token) => {
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "emails",
    "registration.html"
  );
  let emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
  emailTemplate = emailTemplate.replace("[firstName & lastName]", ``);
  emailTemplate = emailTemplate.replace(
    "[verificationUrl]",
    `${process.env.FRONTEND_URL}email-verified?token=${verification_token}`
  );

  return emailTemplate;
};

getForgotPassword = (email, verification_token) => {
  let data =
    `<!DOCTYPE html>
  <html lang="en" style="margin: 0; padding: 0; overflow-x: hidden; box-sizing: border-box;">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Forgot Password</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway:500,700&display=swap" rel="stylesheet">
  </head>
  
  <body style="margin: 0; padding: 0; overflow-x: hidden; box-sizing: border-box; background-color: #444;">
    <section class="container" style="display: grid; justify-content: center;">
      <div class="template-wrapper" style="background-color: #fff; width: 100%;">
        <!--div class="row" style="width: 100%; display: flex;">
          <div class="text-center col logo" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; background: #f4f4f4; border: solid 1px #e4e4e4; padding: 30px 10px;">
            <img src="https://vibrer.cloud/public/images/viberer-logo-light.svg" alt="Hello Worker Logo" style="width: 200px;">
          </div>
        </div-->
        <div class="row" style="width: 100%; display: flex;">
          <div class="col text-center resPW" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; background-color: #ff5d5d; padding: 30px 10px;">
            <h1 style="font-family: sans-serif; color: #ffffff; font-weight: 700; font-size: 1rem; margin: 0; text-transform: uppercase;">
            Reset Password
            </h1>
          </div>
        </div>
        <div class="row" style="width: 100%; display: flex;">
          <div class="col content" style="width: 100%; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 15px;">
            <h3 style="margin: 0; font-family: sans-serif; font-size: 1.1rem; color: #3f3d56; margin-bottom: 8px;">
            Dear ` +
    email +
    `</h3>
            <p style="margin: 0; font-family: sans-serif; line-height: 1.5; color: #ff5d5d; font-size: 1.3rem;">
            Here is your reset password link
            </p>
          </div>
        </div>
        
  
        <div class="row" style="width: 100%; display: flex;">
          <div class="col content" style="width: 100%; padding-left: 30px; padding-right: 30px; padding-top: 15px; padding-bottom: 30px;">
  
            <p style="margin: 0; font-size: 15px; color: #3f3d56; font-family: sans-serif; line-height: 2;">
            To reset password <a style="color: #0369ee;" href="https://vibrer.cloud/reset-password?token=` +
    verification_token +
    `">Click
            Here</a><br>
            Thank you for using the Vibrer.
            </p>
          </div>
        </div>
        <div class="row" style="width: 100%; display: flex;">
          <div class="col footer text-center" style="text-align: center; width: 100%; padding-left: 30px; padding-right: 30px; padding: 30px 10px; background-color: #3f3d56; margin-top: 15px;">
            <p style="margin: 0; font-family: sans-serif; line-height: 1.5; color: #e9e8e8; font-size: 14px;">©
            © 2024 All rights reserved | Vibrer Internet Content Provider L.L.C, UAE</p>
          </div>
        </div>
      </div>
    </section>
  </body>
  
  </html>`;

  return data;
};

getForgotPasswordappUser = (email, verification_token) => {
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "emails",
    "passResetEmail.html"
  );
  let emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");
  emailTemplate = emailTemplate.replace("[firstName & lastName]", `${email}`);
  emailTemplate = emailTemplate.replace(
    "[verificationUrl]",
    `${process.env.FRONTEND_URL}reset-password?token=${verification_token}`
  );

  return emailTemplate;
};

getMessage = (body, to, from, subject) => {
  return {
    to: to,
    from: from,
    subject: subject,
    text: body,
    html: `<strong>${body}</strong>`,
  };
};

render = (res, data) => {
  res.render("scan", { src: data });
};

isValidEmail = (email) => {
  // Simple email format validation using regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  send,
  render,
  getMessage,
  getEmailVerification,
  getForgotPassword,
  generateRandomToken,
  getForgotPasswordappUser,
  isValidEmail,
};
