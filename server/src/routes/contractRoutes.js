const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
// const { authMiddleware } = require('../middleware/auth'); // eeldame, et sul on mingisugune auth

// router.use(authMiddleware); // rakendame autentimise kogu routerile, kui vaja

// GET /contracts?search=&sortBy=&sortOrder=
router.get('/', contractController.getAllContracts);

// POST /contracts
router.post('/', contractController.createContract);

// GET /contracts/:id
router.get('/:id', contractController.getContractById);

// PUT /contracts/:id
router.put('/:id', contractController.updateContract);

// DELETE /contracts/:id
router.delete('/:id', contractController.deleteContract);

/** Templates **/
router.post('/template', contractController.createContractTemplate);
router.get('/template/latest', contractController.getLatestContractTemplate);

router.get('/user/:userId', contractController.getUserContracts);

// Accept contract (update status, create logs, etc.)
router.put('/:contractId/accept', contractController.acceptContract);

// GET contract terms (eraldi päring, kui tahad popupis lepingu terms sisu)
router.get('/terms/:termsId', contractController.getContractTermsById);

module.exports = router;
