const Coin = require("../../model/coin");
const TopCoin = require("../../model/topCoin");
const CoinsHistory = require("../../model/CoinsHistory");
const SavedCoin = require("../../model/SavedCoin");
const moment = require("moment-timezone");
const { COIN_URL } = require("../../config/index");

const addCoinPrice = async (req) => {
  const result = { data: null, code: 500 }; // Default to server error
  try {
    const {
      id,
      symbol,
      name,
      image,
      current_price,
      price_change_percentage_24h,
    } = req.body;

    // Validate required fields
    if (
      !id ||
      !symbol ||
      !name ||
      !image ||
      current_price === undefined ||
      price_change_percentage_24h === undefined
    ) {
      result.code = 400; // Bad request
      result.message = "Missing required fields";
      return result;
    }

    // Check if the coin already exists by ID
    const existingCoin = await Coin.findOne({ id });
    if (existingCoin) {
      result.code = 205; // Duplicate entry
      result.message = "Coin already exists";
      return result;
    }

    // Create a new coin document
    const newCoin = await Coin.create({
      id,
      symbol,
      name,
      image,
      current_price: parseFloat(current_price), // Ensure it's a number
      price_change_percentage_24h: parseFloat(price_change_percentage_24h),
    });

    if (newCoin) {
      result.data = newCoin;
      result.code = 201; // Successfully created
    } else {
      result.code = 204; // No content
    }
  } catch (error) {
    console.error("❌ Error adding coin price:", error.message);
    result.code = 500;
    result.message = "Internal server error";
  }

  return result;
};

const updateCoinPrice = async (req) => {
  const result = { data: null, code: 500 }; // Default response

  try {
    const { id, name, symbol, current_price, price_change_percentage_24h } =
      req.body;

    // Validate required fields
    if (
      !id ||
      !name ||
      !symbol ||
      current_price === undefined ||
      price_change_percentage_24h === undefined
    ) {
      result.code = 400; // Bad Request
      result.message = "Missing required fields";
      return result;
    }

    // Construct update data
    const updatedData = {
      name,
      symbol,
      current_price: parseFloat(current_price),
      price_change_percentage_24h: parseFloat(price_change_percentage_24h),
      updated_at: Date.now(),
    };

    // If an image file is uploaded, update it
    if (req.file) {
      updatedData.image = `${COIN_PRICE_ICON_URL}${req.file.filename}`;
    }

    // Find and update the coin by its `id`
    const updatedCoin = await Coin.findOneAndUpdate({ id }, updatedData, {
      new: true,
    });

    if (updatedCoin) {
      result.data = updatedCoin;
      result.code = 202; // Successfully updated
    } else {
      result.code = 404; // Not Found
      result.message = "Coin not found";
    }
  } catch (error) {
    console.error("❌ Error updating coin price:", error.message);
    result.code = 500;
    result.message = "Internal server error";
  }

  return result;
};

const getAllCoinPrice = async (req) => {
  const result = { data: null, code: 500 }; // Default response

  try {
    let { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    page = parseInt(page);
    limit = parseInt(limit);

    // Fetch total count for pagination metadata
    const totalCoins = await Coin.countDocuments();

    // Fetch paginated coin data sorted by latest update
    const coins = await Coin.find()
      // .sort({ updated_at: -1 }) // Sorting by last updated timestamp
      .skip((page - 1) * limit) // Pagination offset
      .limit(limit);

    // 🔹 Fetch yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0]; // YYYY-MM-DD format

    // 🔹 Fetch yesterday's coin data
    const yesterdayData = await CoinsHistory.findOne({ date: yesterdayStr });

    // 🔹 Create a map of yesterday's prices
    const yesterdayPriceMap = {};
    if (yesterdayData && yesterdayData.coins.length > 0) {
      yesterdayData.coins.forEach((coin) => {
        yesterdayPriceMap[coin.id] = coin.current_price;
      });
    }

    if (coins.length > 0) {
      // Transform coin data
      const coinPriceArry = coins.map((coin) => {
        let yesterday_price = yesterdayPriceMap[coin.id] || null;

        // 🔹 If yesterday_price is not found, calculate it
        if (!yesterday_price && coin.price_change_percentage_24h !== null) {
          yesterday_price =
            coin.current_price / (1 + coin.price_change_percentage_24h / 100);
        }

        return {
          _id: coin._id,
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: COIN_URL + coin.image,
          current_price: coin.current_price,
          yesterday_price: yesterday_price
            ? parseFloat(yesterday_price.toFixed(6))
            : null, // Ensuring Double
          price_change_percentage_24h: coin.price_change_percentage_24h,
          updated_at: coin.updated_at,
        };
      });

      result.data = {
        coins: coinPriceArry,
        pagination: {
          total: totalCoins,
          page,
          limit,
          totalPages: Math.ceil(totalCoins / limit),
        },
      };
      result.code = 200;
    } else {
      result.code = 204; // No Content
      result.message = "No coin data available.";
    }
  } catch (error) {
    console.error("❌ Error fetching coin prices:", error.message);
    result.code = 500;
    result.message = "Internal server error";
  }

  return result;
};

const top10coins = async (req) => {
  const result = { data: null, code: 500 }; // Default response

  try {
    // 🔹 Fetch today's top 10 coins
    const coins = await TopCoin.find();

    // 🔹 Fetch yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0]; // YYYY-MM-DD format

    // 🔹 Fetch yesterday's coin data
    const yesterdayData = await CoinsHistory.findOne({ date: yesterdayStr });

    // 🔹 Create a map of yesterday's prices
    const yesterdayPriceMap = {};
    if (yesterdayData && yesterdayData.coins.length > 0) {
      yesterdayData.coins.forEach((coin) => {
        yesterdayPriceMap[coin.id] = coin.current_price;
      });
    }

    if (coins.length > 0) {
      const coinPriceArry = coins.map((coin) => {
        let yesterday_price = yesterdayPriceMap[coin.id] || null;

        // 🔹 If yesterday_price is not found, calculate it
        if (!yesterday_price && coin.price_change_percentage_24h !== null) {
          yesterday_price =
            coin.current_price / (1 + coin.price_change_percentage_24h / 100);
        }

        return {
          _id: coin._id,
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: COIN_URL + coin.image,
          current_price: coin.current_price,
          yesterday_price: yesterday_price
            ? parseFloat(yesterday_price.toFixed(12))
            : null, // Ensuring Double
          price_change_percentage_24h: coin.price_change_percentage_24h,
          updated_at: coin.updated_at,
        };
      });

      result.data = { coins: coinPriceArry };
      result.code = 200;
    } else {
      result.code = 204; // No Content
      result.message = "No coin data available.";
    }
  } catch (error) {
    console.error("❌ Error fetching top 10 coins:", error.message);
    result.code = 500;
    result.message = "Internal server error";
  }

  return result;
};

const getCoinPrice = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const CoinPrice = await Coin.findById(id);
  if (CoinPrice) {
    result.data = CoinPrice;
    result.code = 200;
  } else {
    result.code = 204;
  }
  return result;
};

const deleteCoinPrice = async (req) => {
  const result = { data: null };
  const id = req.params.id;
  const CoinPrice = await Coin.findByIdAndRemove(id);
  if (CoinPrice) {
    result.data = CoinPrice;
    result.code = 203;
  } else {
    result.code = 204;
  }
  return result;
};

const saveCoinPrice = async (req) => {
  const result = { data: null };
  try {
    const { id } = req.params;
    const user_id = req.decoded.id; // Get logged-in user ID
    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    // Check if the coin exists in the database
    const coin = await Coin.findOne({ id: id });
    if (!coin) {
      result.code = 2045; // Coin not found
      return result;
    }

    // Find today's entry in SavedCoin collection
    let savedCoin = await SavedCoin.findOne({ date: today });

    if (!savedCoin) {
      // ✅ If no entry exists for today, create a new one with the first vote
      savedCoin = new SavedCoin({
        date: today,
        votes: [
          {
            user_id,
            coin_id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
            current_price: coin.current_price,
          },
        ],
      });
      result.code = 201; // New entry created
    } else {
      // ✅ If today's entry exists, check if the user has already voted
      const existingVote = savedCoin.votes.find(
        (vote) => vote.user_id.toString() === user_id
      );

      if (existingVote) {
        // ✅ User has already voted today → Update existing vote details
        existingVote.coin_id = coin.id;
        existingVote.name = coin.name;
        existingVote.symbol = coin.symbol;
        existingVote.image = coin.image;
        existingVote.current_price = coin.current_price;

        result.code = 202; // Vote updated
      } else {
        // ✅ User hasn't voted today → Add new vote entry
        savedCoin.votes.push({
          user_id,
          coin_id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          current_price: coin.current_price,
        });

        result.code = 201; // New vote added
      }
    }

    await savedCoin.save();
    result.data = savedCoin;
  } catch (error) {
    console.error("❌ Error saving vote:", error.message);
    result.code = 500;
  }

  return result;
};

const getTodayVotedCoin = async (req) => {
  const result = { data: null };
  try {
    const user_id = req.decoded.id; // Get logged-in user ID

    // Get today's date in Asia/Kolkata timezone (IST)
    const formattedDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    // Find today's votes directly in the database using $elemMatch
    const savedCoin = await SavedCoin.findOne(
      {
        date: formattedDate,
        "votes.user_id": user_id, // Directly match user_id inside votes array
      },
      { "votes.$": 1 } // Project only the matching vote inside the array
    );

    if (!savedCoin) {
      result.code = 204; // No votes found for today
      return result;
    }

    result.data = savedCoin.votes;
    result.code = 200; // Success
  } catch (error) {
    console.error("❌ Error fetching today's voted coins:", error.message);
    result.code = 500;
  }

  return result;
};

const getAllUserVotedCoins = async (req) => {
  const result = { data: null };
  try {
    const user_id = req.decoded.id; // Get logged-in user ID

    // Fetch all voted coins by user, sorted by date (DESC)
    const votedCoins = await SavedCoin.find(
      {
        "votes.user_id": user_id, // Match votes from this user
      },
      {
        date: 1, // Include date field
        votes: { $elemMatch: { user_id: user_id } }, // Return only matching user's vote
      }
    )
      .sort({ date: -1 }) // Sort by date (descending)
      .lean(); // Convert Mongoose docs to plain JavaScript objects

    if (!votedCoins.length) {
      result.code = 204; // No votes found
      result.message = "No record found";
      return result;
    }

    // 🔹 Map saved votes and fetch latest current_price from Coin collection
    const enrichedVotes = await Promise.all(
      votedCoins.map(async (savedCoin) => {
        const vote = savedCoin.votes[0]; // Since we used `$elemMatch`, there's only one vote

        // Find the latest current_price using symbol
        const coin = await Coin.findOne(
          { symbol: vote.symbol },
          { current_price: 1 }
        ).lean();

        return {
          date: savedCoin.date,
          user_id: vote.user_id,
          coin_id: vote.coin_id,
          name: vote.name,
          symbol: vote.symbol,
          image: COIN_URL + vote.image,
          price: vote.current_price,
          current_price: coin ? coin.current_price : null, // Get price or return null if not found
        };
      })
    );

    result.data = enrichedVotes;
    result.code = 200; // Success
    result.message = "User voted coins retrieved successfully";
  } catch (error) {
    console.error("❌ Error fetching user voted coins:", error.message);
    result.code = 500;
    result.message = "Internal server error";
  }

  return result;
};

module.exports = {
  addCoinPrice,
  updateCoinPrice,
  getAllCoinPrice,
  getCoinPrice,
  deleteCoinPrice,
  top10coins,
  saveCoinPrice,
  getTodayVotedCoin,
  getAllUserVotedCoins,
};
