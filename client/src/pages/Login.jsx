import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import loginImg from "../assets/login.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/api/auth/login", form);

      // store user + token
      localStorage.setItem("user", JSON.stringify(data));

      // go to planner page
      navigate("/plan");
    } catch (error) {
  console.log("LOGIN ERROR:", error.response);
  alert(error.response?.data?.message || "Login failed");
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
      {/* dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
        }}
      />

      {/* form wrapper */}
      <form onSubmit={handleLogin}>
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
            Ready for your next trip?
          </Typography>

          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                py: 1.4,
                fontWeight: "bold",
                letterSpacing: 0.5,
                background: "#c58b5c",
                "&:hover": {
                  background: "#b07647",
                },
              }}
            >
              LOGIN
            </Button>

            <Typography
              textAlign="center"
              sx={{ mt: 1, opacity: 0.85, fontSize: 14 }}
            >
              New user?{" "}
              <Box
                component="span"
                onClick={() => navigate("/register")}
                sx={{
                  color: "#c58b5c",
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Sign up
              </Box>
            </Typography>
          </Box>
        </Paper>
      </form>
    </Box>
  );
}

export default Login;