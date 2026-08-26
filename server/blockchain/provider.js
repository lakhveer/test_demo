const { ethers } = require("ethers");
const ErrorHandler = require("../utils/errorHandler");
const RealEstateABI = require("./abis/RealEstate.json");
const EscrowABI = require("./abis/Escrow.json");

let provider = null;
let signer = null;

function getProvider() {
  if (!process.env.BLOCKCHAIN_RPC_URL) {
    throw new ErrorHandler(
      "Blockchain RPC is not configured. Set BLOCKCHAIN_RPC_URL in the environment.",
      500
    );
  }

  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC_URL
    );
  }

  return provider;
}

function getSigner() {
  if (!process.env.BLOCKCHAIN_PRIVATE_KEY) {
    throw new ErrorHandler(
      "No blockchain signer is configured. Set BLOCKCHAIN_PRIVATE_KEY in the environment.",
      500
    );
  }

  if (!signer) {
    signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, getProvider());
  }

  return signer;
}

function getRealEstateContract({ withSigner = false } = {}) {
  if (!process.env.REAL_ESTATE_CONTRACT_ADDRESS) {
    throw new ErrorHandler(
      "REAL_ESTATE_CONTRACT_ADDRESS is not configured.",
      500
    );
  }

  return new ethers.Contract(
    process.env.REAL_ESTATE_CONTRACT_ADDRESS,
    RealEstateABI,
    withSigner ? getSigner() : getProvider()
  );
}

function getEscrowContract({ withSigner = false } = {}) {
  if (!process.env.ESCROW_CONTRACT_ADDRESS) {
    throw new ErrorHandler("ESCROW_CONTRACT_ADDRESS is not configured.", 500);
  }

  return new ethers.Contract(
    process.env.ESCROW_CONTRACT_ADDRESS,
    EscrowABI,
    withSigner ? getSigner() : getProvider()
  );
}

module.exports = {
  getProvider,
  getSigner,
  getRealEstateContract,
  getEscrowContract,
};
