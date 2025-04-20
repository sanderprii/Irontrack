const express = require('express');
const router = express.Router();
const trainingPlanController = require('../controllers/trainingPlanController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticatedJWT');

// GET /api/training-plans
router.get('/', ensureAuthenticated, trainingPlanController.getTrainingPlans);

// GET /api/training-plans/:id
router.get('/:id', ensureAuthenticated, trainingPlanController.getTrainingPlanById);

// POST /api/training-plans
router.post('/', ensureAuthenticated, trainingPlanController.createTrainingPlan);

// PUT /api/training-plans/:id
router.put('/:id', ensureAuthenticated, trainingPlanController.updateTrainingPlan);

// DELETE /api/training-plans/:id
router.delete('/:id', ensureAuthenticated, trainingPlanController.deleteTrainingPlan);

// POST /api/training-plans/days/:id/comments
router.post('/days/:id/comments', ensureAuthenticated, trainingPlanController.addComment);

// PUT /api/training-plans/sectors/:id/complete
router.put('/sectors/:id/complete', ensureAuthenticated, trainingPlanController.completeSector);

// POST /api/training-plans/sectors/:id/add-to-training
router.post('/sectors/:id/add-to-training', ensureAuthenticated, trainingPlanController.addSectorToTraining);

module.exports = router;