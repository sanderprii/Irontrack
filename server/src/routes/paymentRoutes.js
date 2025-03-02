const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

// Montonio makse loomine
router.post("/payments/montonio", ensureAuthenticated, paymentController.createMontonioPayment);

// Montonio webhook
router.post("/payments/montonio-webhook", paymentController.handleMontonioWebhook);

// Makse staatuse kontrollimine
router.get("/payments/montonio/status", ensureAuthenticated, paymentController.checkPaymentStatus);



module.exports = router;