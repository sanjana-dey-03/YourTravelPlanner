const express = require("express");
const router = express.Router();

const {
  generateTrip,
  getTripById,
  getMyTrips,
  deleteTrip,
  updateHotel,
  getPublicTrip
} = require("../controllers/tripController");

const protect = require("../middleware/authMiddleware");

// generate new trip
router.post("/generate", protect, generateTrip);

// dashboard - get all trips
router.get("/my", protect, getMyTrips);

// open single trip
router.get("/:id", protect, getTripById);

router.get("/public/:shareId", getPublicTrip);

// SAVE HOTEL FOR A SPECIFIC DAY
router.patch("/:tripId/day/:dayNumber/hotel", protect, updateHotel);

// delete trip
router.delete("/:id", protect, deleteTrip);

module.exports = router;