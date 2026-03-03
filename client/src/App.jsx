import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";
import Planner from "./pages/Planner";
import travelImg from "./assets/travel.jpg";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Itinerary from "./pages/Itinerary";
import Dashboard from "./pages/Dashboard";
import SharedItinerary from "./pages/SharedItinerary";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${travelImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Cinematic gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        <Container
          sx={{
            textAlign: "center",
            color: "white",
            position: "relative",
          }}
        >
          <Typography
            variant="h1"
            fontWeight={700}
            sx={{
              letterSpacing: 1,
              textShadow: "0 6px 20px rgba(0,0,0,0.35)",
              mb: 0.5,
            }}
          >
            Your Travel Partner
          </Typography>

          <Typography
            sx={{
              mt: 0,
              mb: 6,
              opacity: 0.95,
              fontSize: { xs: "1.05rem", md: "1.25rem" },
              fontWeight: 400,
              letterSpacing: 0.3,
              mx: "auto",
              lineHeight: 1.6,
              whiteSpace: { xs: "normal", md: "nowrap" },
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Smart itineraries, curated experiences, seamless travel — all in one place
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              px: 5,
              py: 1.6,
              mt: 4,
              background: "rgba(0,0,0,0.30)",
              color: "white",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: "14px",
              fontSize: "0.95rem",
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              transition: "all 0.25s ease",
              "&:hover": {
                background: "rgba(0,0,0,0.40)",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
              },
            }}
          >
            Create My Itinerary
          </Button>
        </Container>
      </Box>
    </>
  );
}

// 🔐 Protected Route
function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/plan"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Planner />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <Navbar />
            <Login />
          </>
        }
      />

      <Route
        path="/register"
        element={
          <>
            <Navbar />
            <Register />
          </>
        }
      />

      <Route
        path="/itinerary/:id"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Itinerary />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Dashboard />
            </>
          </PrivateRoute>
        }
      />

      <Route path="/shared/:shareId" element={<SharedItinerary />} />
      
    </Routes>
  );
}

export default App;
