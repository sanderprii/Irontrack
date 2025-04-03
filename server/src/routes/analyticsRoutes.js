// server/routes/analyticsRoutes.js

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

const  ensureAuthenticatedJWT  = require("../middlewares/ensureAuthenticatedJWT");

// Dashboard Overview
router.get('/dashboard/:affiliateId', ensureAuthenticatedJWT, analyticsController.getDashboardOverview);
// Add to analyticsRoutes.js
router.get('/top-members-checkins/:affiliateId', ensureAuthenticatedJWT, analyticsController.getTopMembersByCheckIns);

// Activity & Behavior
router.get('/activity/:affiliateId', ensureAuthenticatedJWT, analyticsController.getActivityMetrics);
router.get('/heatmap/:affiliateId', ensureAuthenticatedJWT, analyticsController.getVisitHeatmap);
router.get('/at-risk/:affiliateId', ensureAuthenticatedJWT, analyticsController.getAtRiskMembers);
router.get('/visit-frequency/:affiliateId', ensureAuthenticatedJWT, analyticsController.getVisitFrequency);

// Financial Analysis
router.get('/contracts-overview/:affiliateId', ensureAuthenticatedJWT, analyticsController.getContractOverview);
router.get('/arpu/:affiliateId', ensureAuthenticatedJWT, analyticsController.getArpu);
router.get('/payment-health/:affiliateId', ensureAuthenticatedJWT, analyticsController.getPaymentHealth);
router.get('/suspended-contracts/:affiliateId', ensureAuthenticatedJWT, analyticsController.getSuspendedContracts);
router.get('/expiring-contracts/:affiliateId', ensureAuthenticatedJWT, analyticsController.getContractExpirations);

// Training & Service Analysis
router.get('/class-capacity/:affiliateId', ensureAuthenticatedJWT, analyticsController.getClassCapacity);
router.get('/training-types/:affiliateId', ensureAuthenticatedJWT, analyticsController.getTrainingTypePopularity);
router.get('/trainer-comparison/:affiliateId', ensureAuthenticatedJWT, analyticsController.getTrainerComparison);

// Client Retention & Engagement
router.get('/churn/:affiliateId', ensureAuthenticatedJWT, analyticsController.getChurnAnalysis);
router.get('/client-lifecycle/:affiliateId', ensureAuthenticatedJWT, analyticsController.getClientLifecycle);
router.get('/client-achievements/:affiliateId', ensureAuthenticatedJWT, analyticsController.getClientAchievements);

// Growth Potential
router.get('/dormant-clients/:affiliateId', ensureAuthenticatedJWT, analyticsController.getDormantClients);
router.get('/growth-opportunities/:affiliateId', ensureAuthenticatedJWT, analyticsController.getGrowthOpportunities);

// Early Warning System
router.get('/early-warnings/:affiliateId', ensureAuthenticatedJWT, analyticsController.getEarlyWarnings);

module.exports = router;