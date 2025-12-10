require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, POLYGON_AMOY_URL } = process.env;

module.exports = {
  solidity: "0.8.28",
  networks: {
    polygon_amoy: {
      url: POLYGON_AMOY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: "YOUR_API_KEY_HERE" // optional, only needed if you want contract verification
  },
};
