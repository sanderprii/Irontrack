const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

const {
    getUserCredits,
    addCredit,
    getCreditHistory, getUserTransactions,
    getAffiliateTransactions
} = require('../controllers/creditController');

// API endpointid
// GET /credit?affiliateId=...&userId=...
router.get('/credit', ensureAuthenticated, getUserCredits);

// POST /credit
router.post('/credit', ensureAuthenticated, addCredit);

// GET /credit/history?affiliateId=...&userId=...
router.get('/credit/history', ensureAuthenticated, getCreditHistory);
router.get('/credit/transactions', ensureAuthenticated, getUserTransactions);
router.get('/credit/affiliate-transactions', ensureAuthenticated,  getAffiliateTransactions);


module.exports = router;