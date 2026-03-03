import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import plannerBg from "../assets/login.jpg";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const { data } = await API.get("/trip/my");
      setTrips(data);
    } catch (err) {
      console.log(err);
      alert("Failed to load trips");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/trip/${id}`);
      fetchTrips();
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 12,
        px: 4,
        position: "relative",
        backgroundImage: `url(${plannerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* blur overlay */}
      <Box
  sx={{
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.15), rgba(0,0,0,0.35))",
  }}
/>

      {/* content */}
      <Box position="relative">
        <Typography variant="h4" mb={3} fontWeight="bold" color="white">
          My Trips
        </Typography>

        <Grid container spacing={3}>
          {trips.map((trip) => (
            <Grid item xs={12} md={6} lg={4} key={trip._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                {trip.image && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={trip.image}
                    alt={trip.destination}
                  />
                )}

                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {trip.destination}
                  </Typography>

                  <Typography>Days: {trip.days}</Typography>
                  <Typography>Budget: ₹{trip.budget}</Typography>

                  <Box mt={2} display="flex" gap={1}>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/itinerary/${trip._id}`)}
                    >
                      Open
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(trip._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {trips.length === 0 && (
          <Typography mt={3}>
            No trips yet. Start planning 🚀
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;