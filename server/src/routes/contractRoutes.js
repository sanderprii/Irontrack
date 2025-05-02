const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

router.use(ensureAuthenticated); // rakendame autentimise kogu routerile, kui vaja

// GET /contracts?search=&sortBy=&sortOrder=
router.get('/', contractController.getAllContracts);

// POST /contracts
router.post('/', contractController.createContract);

/** Templates **/
router.post('/template', contractController.createContractTemplate);
router.get('/template/latest', contractController.getLatestContractTemplate);

// GET contract terms
router.get('/terms/:termsId', contractController.getContractTermsById);

// OLULINE: Enne spetsiifilised marsruudid, siis dünaamilised
router.get('/unpaid', contractController.getUnpaidUsers);

router.get('/user/:userId', contractController.getUserContracts);

// Accept contract (update status, create logs, etc.)
router.post('/:contractId/accept', contractController.acceptContract);

router.post('/:contractId/payment-holiday', contractController.createPaymentHoliday);

router.put('/:phId/update-payment-holiday', contractController.updatePaymentHoliday);

// NB! Dünaamilised marsruudid (:id) tuleb panna VIIMASEKS
// GET /contracts/:id
router.get('/:id', contractController.getContractById);

// PUT /contracts/:id
router.put('/:id', contractController.updateContract);

// DELETE /contracts/:id
router.delete('/:id', contractController.deleteContract);

router.put('/unpaid/:id', contractController.updateUnpaidUser);

module.exports = router;