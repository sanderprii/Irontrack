const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

// GET contract terms - no authentication required
router.get('/terms/:termsId', contractController.getContractTermsById);

// All other routes require authentication
// GET /contracts?search=&sortBy=&sortOrder=
router.get('/', ensureAuthenticated, contractController.getAllContracts);

// POST /contracts
router.post('/', ensureAuthenticated, contractController.createContract);

/** Templates **/
router.post('/template', ensureAuthenticated, contractController.createContractTemplate);
router.get('/template/latest', ensureAuthenticated, contractController.getLatestContractTemplate);

// OLULINE: Enne spetsiifilised marsruudid, siis dünaamilised
router.get('/unpaid', ensureAuthenticated, contractController.getUnpaidUsers);

router.get('/user/:userId', ensureAuthenticated, contractController.getUserContracts);

// Accept contract (update status, create logs, etc.)
router.post('/:contractId/accept', ensureAuthenticated, contractController.acceptContract);

router.post('/:contractId/payment-holiday', ensureAuthenticated, contractController.createPaymentHoliday);

router.put('/:phId/update-payment-holiday', ensureAuthenticated, contractController.updatePaymentHoliday);

// NB! Dünaamilised marsruudid (:id) tuleb panna VIIMASEKS
// GET /contracts/:id
router.get('/:id', ensureAuthenticated, contractController.getContractById);

// PUT /contracts/:id
router.put('/:id', ensureAuthenticated, contractController.updateContract);

// DELETE /contracts/:id
router.delete('/:id', ensureAuthenticated, contractController.deleteContract);

router.put('/unpaid/:id', ensureAuthenticated, contractController.updateUnpaidUser);

module.exports = router;