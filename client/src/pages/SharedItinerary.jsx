import { Box, Typography, Card, CardContent } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import itineraryBg from "../assets/itinerary.jpg";

function SharedItinerary() {
  const { shareId } = useParams();

  const [trip, setTrip] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await API.get(`/trip/public/${shareId}`);
        setTrip(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrip();
  }, [shareId]);

  if (!trip) {
    return (
      <Box sx={{ textAlign: "center", mt: 20 }}>
        <Typography variant="h5">Loading shared itinerary...</Typography>
      </Box>
    );
  }

  const day = trip.itinerary[index];

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f7fa" }}>
      
      {/* HERO */}
      <Box
        sx={{
          height: 260,
          position: "relative",
          backgroundImage: `url(${trip.image || itineraryBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.65))",
            display: "flex",
            alignItems: "flex-end",
            p: 4,
            color: "white",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {trip.destination}
            </Typography>
            <Typography>
              {trip.days} Days • ₹{trip.budget}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Day {index + 1}
        </Typography>

        {day.places.map((place, i) => (
          <Card key={i} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight={700}>{place.name}</Typography>

              <Typography color="text.secondary" mb={1}>
                {place.description}
              </Typography>

              <Typography fontSize={13}>
                {place.timeOfDay} • Best: {place.bestTime} • {place.duration}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default SharedItinerary;