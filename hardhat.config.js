require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "./contract/.env" });

module.exports = {
  solidity: "0.8.28",
  networks: {
    polygon_amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [process.env.PRIVATE_KEY], // your wallet private key from .env
      chainId: 80002,
    },
  },
  paths: {
    sources: "./contract",  // since your contracts are in /contract folder
    artifacts: "./contract/artifacts",
    cache: "./cache",
    tests: "./test"
  }
};
