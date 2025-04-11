const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ensureAuthenticatedJWT = require('../middlewares/ensureAuthenticatedJWT');

// Existing routes
router.get('/user-data', ensureAuthenticatedJWT, userController.getUserData);
router.get('/user-visit-history', ensureAuthenticatedJWT, userController.getVisitHistory);
router.get('/user-purchase-history', ensureAuthenticatedJWT, userController.getPurchaseHistory);
router.post('/change-password', ensureAuthenticatedJWT, userController.changePassword);
router.post('/profile', ensureAuthenticatedJWT, userController.editProfile);
router.get('/', ensureAuthenticatedJWT, userController.getUser);
router.put('/', ensureAuthenticatedJWT, userController.updateUserData);
router.get('/user-plans', ensureAuthenticatedJWT, userController.getUserPlansByAffiliate);
router.post('/notes/:userId/notes', ensureAuthenticatedJWT, userController.addUserNote);
router.delete('/notes/:userId/notes/:noteId', ensureAuthenticatedJWT, userController.deleteUserNote);
router.get('/attendees', ensureAuthenticatedJWT, userController.getUserAttendees);

// New family member routes
router.get('/family-members', ensureAuthenticatedJWT, userController.getFamilyMembers);
router.post('/family-members', ensureAuthenticatedJWT, userController.addFamilyMember);
router.delete('/family-members/:id', ensureAuthenticatedJWT, userController.deleteFamilyMember);

module.exports = router;