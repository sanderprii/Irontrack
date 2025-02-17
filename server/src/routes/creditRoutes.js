const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

const {
    getUserCredits,
    addCredit,
    getCreditHistory, getUserTransactions
} = require('../controllers/creditController');

// API endpointid
// GET /credit?affiliateId=...&userId=...
router.get('/credit', getUserCredits);

// POST /credit
router.post('/credit', addCredit);

// GET /credit/history?affiliateId=...&userId=...
router.get('/credit/history', getCreditHistory);
router.get('/credit/transactions', getUserTransactions);


module.exports = router;