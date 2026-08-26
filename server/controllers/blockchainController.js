const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const {
  getRealEstateContract,
  getEscrowContract,
} = require("../blockchain/provider");

// Get NFT Details (owner + tokenURI)
exports.getNftDetails = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const realEstate = getRealEstateContract();

  const [owner, tokenURI] = await Promise.all([
    realEstate.ownerOf(id),
    realEstate.tokenURI(id),
  ]);

  res.status(200).json({
    success: true,
    nft: {
      tokenId: id,
      owner,
      tokenURI,
    },
  });
});

// Get Total Minted Supply
exports.getTotalSupply = asyncErrorHandler(async (req, res, next) => {
  const realEstate = getRealEstateContract();
  const totalSupply = await realEstate.totalSupply();

  res.status(200).json({
    success: true,
    totalSupply: totalSupply.toString(),
  });
});

// Get Escrow Status for an NFT
exports.getEscrowStatus = asyncErrorHandler(async (req, res, next) => {
  const { nftId } = req.params;
  const escrow = getEscrowContract();

  const [isListed, purchasePrice, escrowAmount, buyer, inspectionPassed] =
    await Promise.all([
      escrow.isListed(nftId),
      escrow.purchasePrice(nftId),
      escrow.escrowAmount(nftId),
      escrow.buyer(nftId),
      escrow.inspectionPassed(nftId),
    ]);

  res.status(200).json({
    success: true,
    escrow: {
      nftId,
      isListed,
      purchasePrice: purchasePrice.toString(),
      escrowAmount: escrowAmount.toString(),
      buyer,
      inspectionPassed,
    },
  });
});

// Update Inspection Status ---ADMIN (server-signed tx)
exports.updateInspectionStatus = asyncErrorHandler(async (req, res, next) => {
  const { nftId } = req.params;
  const { passed } = req.body;

  if (typeof passed !== "boolean") {
    return next(new ErrorHandler("passed must be a boolean", 400));
  }

  const escrow = getEscrowContract({ withSigner: true });
  const tx = await escrow.updateInspectionStatus(nftId, passed);
  const receipt = await tx.wait(1);

  res.status(200).json({
    success: true,
    txHash: receipt.transactionHash,
  });
});

// Approve Sale ---ADMIN (server-signed tx)
exports.approveSale = asyncErrorHandler(async (req, res, next) => {
  const { nftId } = req.params;

  const escrow = getEscrowContract({ withSigner: true });
  const tx = await escrow.approveSale(nftId);
  const receipt = await tx.wait(1);

  res.status(200).json({
    success: true,
    txHash: receipt.transactionHash,
  });
});

// Finalize Sale ---ADMIN (server-signed tx)
exports.finalizeSale = asyncErrorHandler(async (req, res, next) => {
  const { nftId } = req.params;

  const escrow = getEscrowContract({ withSigner: true });
  const tx = await escrow.finalizeSale(nftId);
  const receipt = await tx.wait(1);

  res.status(200).json({
    success: true,
    txHash: receipt.transactionHash,
  });
});
