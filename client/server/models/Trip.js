const mongoose = require("mongoose");

/*
  Each day contains:
  - day number
  - hotel (user will enter later)
  - AI enriched places (objects now, not strings)
*/

const placeSchema = new mongoose.Schema({
  name: String,
  timeOfDay: String,   // ⭐ ADD THIS
  description: String,
  bestTime: String,
  duration: String,
  travelTip: String,
  type: String,
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },

  hotel: {
    name: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
  },

  places: [placeSchema],
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    days: {
      type: Number,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    image: {
  type: String,
},

shareId: {
  type: String,
  unique: true,
  index: true,
},

itinerary: {
  type: [daySchema],
  required: true,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
