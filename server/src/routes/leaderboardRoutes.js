const express = require("express");
const router = express.Router();
const { getClassLeaderboard } = require("../controllers/leaderboardController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

router.get("/leaderboard", getClassLeaderboard);

module.exports = router;
