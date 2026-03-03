const Trip = require("../models/Trip");
const axios = require("axios");
const crypto = require("crypto");

// ================= GENERATE TRIP =================
const generateTrip = async (req, res) => {
  try {
    const {
      destination,
      days,
      budget,
      travelStyle,
      transport,
      food,
      interests,
    } = req.body;

    const userId = req.user._id;

    // ---------- ENHANCED STORYTELLING PROMPT ----------
    const prompt = `
You are a professional travel planner and storyteller.

Create a ${days}-day travel itinerary for ${destination} within a budget of ₹${budget}.

STRICT REQUIREMENTS:
- Each day must include at least 5 places (5 to 7 recommended)
- Distribute them across morning, late morning, afternoon, evening and night
- Prefer walkable logical order (nearby locations together)
- Mix major attractions with one relaxing or food experience
- Never return fewer than 5 places
- Every place MUST include the field "timeOfDay"
- "timeOfDay" MUST be exactly one of: morning, late morning, afternoon, evening, night
- Do NOT merge timeOfDay into bestTime
- bestTime must only describe the ideal visiting window (example: 7:00 AM – 8:30 AM golden light)

WRITING STYLE:
- Write like a human travel guide, not Wikipedia
- Make the reader imagine being there (sounds, colors, atmosphere)
- Avoid generic phrases like "famous place" or "popular attraction"
- Each description must be at least 2 full sentences
- Make the experience feel exciting and immersive

User Preferences:
Travel Style: ${travelStyle}
Transport Mode: ${transport}
Food Preference: ${food}
Interests: ${interests?.join(", ") || "General sightseeing"}

IMPORTANT:
Return ONLY valid JSON. No explanation. No markdown. No extra text.

JSON FORMAT STRICTLY:

{
  "itinerary": [
    {
      "day": 1,
      "theme": "short title for the day",
      "places": [
        {
          "name": "",
          "timeOfDay": "REQUIRED: exactly one of morning, late morning, afternoon, evening, night",
          "bestTime": "realistic visiting window (example: 6:30 AM sunrise golden light)",
          "duration": "human readable range (example: 1–2 hrs)",
          "description": "2-3 vivid engaging sentences describing the experience",
          "travelTip": "specific actionable advice",
          "type": "temple | museum | market | food | nature | landmark"
        }
      ]
    }
  ]
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        temperature: 0.5,
        messages: [
          { role: "system", content: "You output only valid JSON and strictly follow the schema." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let formattedItinerary;

    try {
      const parsed = JSON.parse(response.data.choices[0].message.content);
      console.log("AI OUTPUT:\n", JSON.stringify(parsed, null, 2));

      let aiDays = parsed.itinerary || [];

      // 🔥 FORCE timeOfDay if missing
      const timeSlots = ["morning", "late morning", "afternoon", "evening", "night"];

      aiDays = aiDays.map(day => ({
        ...day,
        places: (day.places || []).map((place, index) => ({
          timeOfDay: place.timeOfDay || timeSlots[index % timeSlots.length],
          name: place.name || "",
          description: place.description || "",
          bestTime: place.bestTime || "",
          duration: place.duration || "1–2 hrs",
          travelTip: place.travelTip || "",
          type: place.type || "landmark",
        }))
      }));

      formattedItinerary = aiDays;

    } catch (err) {
      console.error("AI JSON PARSE FAILED:", response.data.choices[0].message.content);
      return res.status(500).json({ message: "AI returned invalid itinerary format" });
    }

    // ---------- FETCH DESTINATION IMAGE ----------
    let imageUrl = "";
    try {
      const imgRes = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query: destination,
            per_page: 1,
            orientation: "landscape",
          },
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      imageUrl = imgRes.data.results[0]?.urls?.regular || "";
    } catch (err) {
      console.log("Unsplash image fetch failed");
    }

    const trip = await Trip.create({
      user: userId,
      destination,
      days,
      budget,
      travelStyle,
      transport,
      food,
      interests,
      itinerary: formattedItinerary,
      image: imageUrl,
      shareId: crypto.randomBytes(16).toString("hex"),
    });

    res.json({ tripId: trip._id });

  } catch (error) {
    console.log("\n===== TRIP GENERATION ERROR =====");

    if (error.response) {
      console.log("AI RESPONSE ERROR:");
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    console.log("SERVER ERROR:");
    console.log(error);

    res.status(500).json({
      message: "Trip generation failed",
      error: error.message,
    });
  }
};

// ================= UPDATE HOTEL =================
const updateHotel = async (req, res) => {
  try {
    const { tripId, dayNumber } = req.params;
    const { hotel } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const day = trip.itinerary.find((d) => d.day === Number(dayNumber));
    if (!day) return res.status(404).json({ message: "Day not found" });

    day.hotel = {
      name: hotel,
      address: hotel,
    };

    await trip.save();

    res.json({ success: true, hotel: day.hotel });
  } catch (err) {
    console.error("UPDATE HOTEL ERROR:", err);
    res.status(500).json({ message: "Failed to update hotel" });
  }
};

// ================= GET SINGLE TRIP =================
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trip" });
  }
};

// ================= GET MY TRIPS =================
const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trips" });
  }
};

// ================= DELETE TRIP =================
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.json({ message: "Trip deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting trip" });
  }
};

const getPublicTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ shareId: req.params.shareId });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching shared trip" });
  }
};

module.exports = {
  generateTrip,
  updateHotel,
  getTripById,
  getMyTrips,
  deleteTrip,
  getPublicTrip,
};