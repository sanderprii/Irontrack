const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");

const { checkClassScore, addClassScore, updateClassScore } = require("../controllers/classController");

// API endpointid
router.get("/class-info",  classController.getClassInfo);
router.get("/classes", classController.getClasses);
router.post("/classes", ensureAuthenticated, classController.createClass);
router.put("/classes/:id", ensureAuthenticated, classController.updateClass);
router.delete("/classes/:id", ensureAuthenticated, classController.deleteClass);
router.get("/class-attendees", classController.getClassAttendees);
router.post("/classes/register", ensureAuthenticated, classController.registerForClass);
router.post("/classes/cancel", ensureAuthenticated, classController.cancelRegistration);
router.get("/class/check-enrollment",  ensureAuthenticated, classController.checkUserEnrollment);
router.get("/attendees/:classId",  classController.getClassAttendeesCount);

router.patch("/class-attendees/check-in",  ensureAuthenticated,classController.checkInAttendee);
router.delete("/class-attendees", ensureAuthenticated, classController.deleteAttendee);

router.get("/classes/leaderboard/check", ensureAuthenticated,checkClassScore);
router.post("/classes/leaderboard/add", ensureAuthenticated, addClassScore);
router.put("/classes/leaderboard/update", ensureAuthenticated, updateClassScore);

router.get("/classes/waitlist", ensureAuthenticated, classController.getWaitlist);
router.post("/classes/waitlist", ensureAuthenticated, classController.createWaitlist);
router.delete("/classes/waitlist/remove", ensureAuthenticated, classController.deleteWaitlist);

module.exports = router;
