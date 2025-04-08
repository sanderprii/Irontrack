const express = require("express");
const router = express.Router();

// Import controllers
const trainerController = require("../controllers/trainerController");
const trainingPlanController = require("../controllers/trainingPlanController");

// Import JWT authentication middleware
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

// Get trainer's affiliates
router.get("/affiliates", ensureAuthenticated, trainerController.getTrainerAffiliates);

// Training plan routes
router.get("/plans", ensureAuthenticated, trainingPlanController.getTrainingPlans);
router.get("/plans/:id", ensureAuthenticated, trainingPlanController.getTrainingPlanById);
router.post("/plans", ensureAuthenticated, trainingPlanController.createTrainingPlan);
router.put("/plans/:id", ensureAuthenticated, trainingPlanController.updateTrainingPlan);
router.delete("/plans/:id", ensureAuthenticated, trainingPlanController.deleteTrainingPlan);

// Training day comments
router.post("/plans/comment", ensureAuthenticated, trainingPlanController.addComment);

// Training day sectors
router.post("/plans/sector", ensureAuthenticated, trainingPlanController.addSector);
router.put("/plans/sector/complete", ensureAuthenticated, trainingPlanController.completeSector);

module.exports = router;