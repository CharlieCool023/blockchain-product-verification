require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/434a1150e0414f6a8ca06036810b6d42",
      accounts: [`0x7619ba2906071d539069847e66bf9d77f2e400b2daee990859ce9c0e7e431053`],
    },
  },
};
