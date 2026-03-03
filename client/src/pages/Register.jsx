import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import loginImg from "../assets/login.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/api/auth/register", form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/plan");
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 10,
        backgroundImage: `url(${loginImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Same overlay as Login page */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
        }}
      />

      <form onSubmit={handleRegister}>
        <Paper
          elevation={0}
          sx={{
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.94)",
            borderRadius: 5,
            padding: 5,
            width: 380,
            position: "relative",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 2.5, color: "#2b2b2b", letterSpacing: 0.3 }}
          >
            Create your TripAI account
          </Typography>

          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.4,
              fontWeight: "bold",
              letterSpacing: 0.5,
              background: "#c58b5c",
              "&:hover": {
                background: "#b07647",
              },
            }}
          >
            SIGN UP
          </Button>

          <Typography
            textAlign="center"
            sx={{ mt: 1.5, opacity: 0.85, fontSize: 14 }}
          >
            Already have an account?{" "}
            <Box
              component="span"
              onClick={() => navigate("/login")}
              sx={{
                color: "#c58b5c",
                cursor: "pointer",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Login
            </Box>
          </Typography>
        </Paper>
      </form>
    </Box>
  );
}

export default Register;