const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

router.get("/plans", ensureAuthenticated, planController.getPlans);
router.post("/plans", ensureAuthenticated, planController.createPlan);
router.put("/plans/:id", ensureAuthenticated,  planController.updatePlan);
router.delete("/plans/:id", ensureAuthenticated, planController.deletePlan);
router.post("/plans/buy-plan/:affiliateId", ensureAuthenticated, planController.handleBuyPlan);
router.get("/plans/credit/:affiliateId", ensureAuthenticated, planController.getUserCredit);
// PUT: uuendab olemasolevat plaani
router.put("/plans/user/:id", ensureAuthenticated, planController.updateUserPlan);

// POST: määrab kasutajale plaani (salvestub UserPlan tabelisse)
router.post("/plans/assign", ensureAuthenticated, planController.assignPlanToUser);
module.exports = router;
