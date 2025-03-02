// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require('../controllers/messageController');

const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");



// POST /api/messages/send
router.post('/send', ensureAuthenticated, messageController.sendMessage);
router.get("/", ensureAuthenticated, messageController.getAllMessages);
router.get('/sent', ensureAuthenticated, messageController.getSentMessages);
router.post('/send-to-affiliate', ensureAuthenticated, messageController.sendMessageToAffiliate);
module.exports = router;
