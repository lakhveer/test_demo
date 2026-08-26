const express = require("express");
const {
  getNftDetails,
  getTotalSupply,
  getEscrowStatus,
  updateInspectionStatus,
  approveSale,
  finalizeSale,
} = require("../controllers/blockchainController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");

const router = express.Router();

router.route("/nft/total-supply").get(getTotalSupply);
router.route("/nft/:id").get(getNftDetails);

router.route("/escrow/:nftId").get(getEscrowStatus);

router
  .route("/escrow/:nftId/inspection")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateInspectionStatus);

router
  .route("/escrow/:nftId/approve")
  .put(isAuthenticatedUser, authorizeRoles("admin"), approveSale);

router
  .route("/escrow/:nftId/finalize")
  .put(isAuthenticatedUser, authorizeRoles("admin"), finalizeSale);

module.exports = router;
