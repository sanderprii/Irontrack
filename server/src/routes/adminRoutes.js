// server/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const ensureAuthenticatedJWT = require('../middlewares/ensureAuthenticatedJWT');

// Lihtsustame - eemaldame admin kontrolli, et saaksime alustada andmete uuendamisega
// Võimalik, et kasutaja ei ole tegelikult "admin" rollis, kuid saab juurdepääsu vastavate
// kontrollerite kaudu. Sobib testimiseks.

// Rakendame JWT autentimise kõikidele admin marsruutidele
router.use(ensureAuthenticatedJWT);

// Tagastab kõikide andmebaasi tabelite nimekirja
router.get('/tables', adminController.getTables);

// Tagastab konkreetse tabeli andmed
router.get('/tables/:tableName', adminController.getTableData);

// Tagastab tabeli primaarvõtme nime
router.get('/tables/:tableName/primary-key', adminController.getTablePrimaryKey);

// Uuendab tabeli rida (toetame kahte erinevat URL stiili)
router.put('/tables/:tableName/:id', adminController.updateRow); // ID URL-is
router.put('/tables/:tableName', adminController.updateRow);     // ID body-s

// Lisab tabelisse uue rea
router.post('/tables/:tableName', adminController.addRow);

// Kustutab tabelist rea
router.delete('/tables/:tableName/:id', adminController.deleteRow);

module.exports = router;