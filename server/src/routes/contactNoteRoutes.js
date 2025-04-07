const express = require("express");
const router = express.Router();

// Impordi Contact Note Controller
const contactNoteController = require("../controllers/contactNoteController");

// Impordi JWT autentimise middleware
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

// Kontrolli, kas kõik vajalikud funktsioonid on olemas
if (!contactNoteController.getContactNotes ||
    !contactNoteController.createContactNote ||
    !contactNoteController.updateContactNote ||
    !contactNoteController.deleteContactNote) {
    console.error("❌ ERROR: One or more controller functions are missing!");
    process.exit(1); // Peatab serveri käivitamise, kui midagi on puudu
}

// Defineeri API teed (routes)
router.get("/contact-notes", ensureAuthenticated, contactNoteController.getContactNotes);
router.post("/contact-note", ensureAuthenticated, contactNoteController.createContactNote);
router.put("/contact-note/:id", ensureAuthenticated, contactNoteController.updateContactNote);
router.delete("/contact-note/:id", ensureAuthenticated, contactNoteController.deleteContactNote);

module.exports = router;