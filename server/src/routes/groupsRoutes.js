// routes/groupsRoutes.js
const express = require('express');
const router = express.Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticatedJWT');
const {
    getGroups,
    createGroup,
    updateGroup,
    searchUsersInGroups,
} = require('../controllers/groupsController');

// Hangi kõik grupid (või grupeeritult)
router.get('/', ensureAuthenticated, getGroups);

// Loo uus grupp
router.post('/', ensureAuthenticated, createGroup);

// Uuenda olemasolevat gruppi (id alusel)
router.put('/:id', ensureAuthenticated, updateGroup);

// Kasutajate otsing (fullName) - näiteks /messagegroups/search?query=John
router.get('/search', ensureAuthenticated, searchUsersInGroups);

module.exports = router;
