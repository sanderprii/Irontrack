// routes/logoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    storage: multer.memoryStorage()
});

const { uploadLogo, uploadProfilePicture } = require('../controllers/logoController');

router.post('/upload-logo', upload.single('logo'), uploadLogo);
// Muudame siin 'file' -> 'logo'
router.post('/upload-profile-picture', upload.single('logo'), uploadProfilePicture);

module.exports = router;