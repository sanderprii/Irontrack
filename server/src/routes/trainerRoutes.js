const express = require("express");
const router = express.Router();

// ✅ Impordi Trainer Controller
const trainerController = require("../controllers/trainerController");

// ✅ Impordi JWT autentimise middleware
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

router.get("/affiliates", ensureAuthenticated, trainerController.getTrainerAffiliates);

module.exports = router;