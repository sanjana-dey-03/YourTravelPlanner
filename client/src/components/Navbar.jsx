import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isPlan = location.pathname === "/plan";
  const isDashboard = location.pathname === "/dashboard"; // ← added

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.35), rgba(0,0,0,0))",
        color: "white",
        px: 2,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 72,
        }}
      >
        {/* Left side */}
        <Box display="flex" alignItems="center" gap={1.5}>
          {!isHome && (
            <IconButton color="inherit" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          )}

          
        </Box>

        {/* Right side */}

        {/* Home page → LOGIN */}
        {isHome && (
          <Button
  onClick={() => navigate("/login")}
  sx={{
    color: "white",
    fontSize: "1rem",
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
    px: 2.5,
    py: 1,
    borderRadius: "10px",
    transition: "all 0.25s ease",

    "&:hover": {
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(6px)",
    },
  }}
>
  Login
</Button>
        )}

        {/* Plan page → DASHBOARD + LOGOUT */}
        {isPlan && (
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              color="inherit"
              sx={{ fontWeight: 500, letterSpacing: 0.5 }}
              onClick={() => navigate("/dashboard")}
            >
              DASHBOARD
            </Button>

            <Button
              color="inherit"
              sx={{ fontWeight: 500, letterSpacing: 0.5 }}
              onClick={handleLogout}
            >
              LOGOUT
            </Button>
          </Box>
        )}

        {/* Dashboard page → PLAN TRIP + LOGOUT */}
        {isDashboard && (
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              color="inherit"
              sx={{ fontWeight: 500, letterSpacing: 0.5 }}
              onClick={() => navigate("/plan")}
            >
              PLAN TRIP
            </Button>

            <Button
              color="inherit"
              sx={{ fontWeight: 500, letterSpacing: 0.5 }}
              onClick={handleLogout}
            >
              LOGOUT
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;