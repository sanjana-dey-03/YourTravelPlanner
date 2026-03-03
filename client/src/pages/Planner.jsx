import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import plannerImg from "../assets/planner.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Planner() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    destination: "",
    days: "",
    budget: "",
    travelStyle: "Balanced",
    transport: "Public",
    food: "Both",
    interests: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.destination || !form.days || !form.budget) {
      alert("Please fill all fields");
      return;
    }
    setStep(2);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { data } = await API.post("/trip/generate", form);

      if (!data.tripId) throw new Error("Trip was not saved properly");

      navigate(`/itinerary/${data.tripId}`);
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 10,
        backgroundImage: `url(${plannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />

      <form onSubmit={handleGenerate}>
        <Paper
          elevation={0}
          sx={{
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.94)",
            borderRadius: 5,
            padding: 5,
            width: 420,
            position: "relative",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
  variant="h5"
  textAlign="center"
  fontWeight={600}
  sx={{
    mb: 2.5,
    letterSpacing: 0.3,
    color: "#2b2b2b"
  }}
>
  {step === 1 ? "Plan Your Trip" : "Personalize Your Trip"}
</Typography>

          <Box display="flex" flexDirection="column" gap={3}>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <TextField label="Destination" name="destination" value={form.destination} onChange={handleChange} fullWidth required />
                <TextField label="Number of Days" name="days" type="number" value={form.days} onChange={handleChange} fullWidth required />
                <TextField label="Budget (₹)" name="budget" type="number" value={form.budget} onChange={handleChange} fullWidth required />

                <Button
                  onClick={handleNext}
                  variant="contained"
                  size="large"
                  sx={{ py: 1.4, fontWeight: "bold", background: "#c58b5c", "&:hover": { background: "#b07647" } }}
                >
                  NEXT
                </Button>
              </>
            )}

            {/* STEP 2 */}
{step === 2 && (
  <>
    {/* Travel Style */}
    <Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#5a5a5a", mb: 0.7, ml: 0.5 }}>
        Travel Style
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          name="travelStyle"
          value={form.travelStyle}
          onChange={handleChange}
          sx={{
            borderRadius: 3,
            background: "#fafafa",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#c58b5c" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#c58b5c" },
          }}
        >
          <MenuItem value="Relaxed">Relaxed</MenuItem>
          <MenuItem value="Balanced">Balanced</MenuItem>
          <MenuItem value="Packed">Packed</MenuItem>
        </Select>
      </FormControl>
    </Box>

    {/* Transport */}
    <Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#5a5a5a", mb: 0.7, ml: 0.5 }}>
        Transport Mode
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          name="transport"
          value={form.transport}
          onChange={handleChange}
          sx={{
            borderRadius: 3,
            background: "#fafafa",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#c58b5c" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#c58b5c" },
          }}
        >
          <MenuItem value="Public">Public Transport (Metro/Bus)</MenuItem>
          <MenuItem value="Cab">Cab / Auto</MenuItem>
          <MenuItem value="Self-drive">Self Drive</MenuItem>
        </Select>
      </FormControl>
    </Box>

    {/* Food */}
    <Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#5a5a5a", mb: 0.7, ml: 0.5 }}>
        Food Preference
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          name="food"
          value={form.food}
          onChange={handleChange}
          sx={{
            borderRadius: 3,
            background: "#fafafa",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#c58b5c" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#c58b5c" },
          }}
        >
          <MenuItem value="Veg">Veg</MenuItem>
          <MenuItem value="Non-veg">Non-veg</MenuItem>
          <MenuItem value="Both">Both</MenuItem>
        </Select>
      </FormControl>
    </Box>

    {/* Interests */}
    <Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#5a5a5a", mb: 1 }}>
        Interests
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {["Nature","History","Food","Shopping","Nightlife","Adventure"].map((item) => (
          <Chip
            key={item}
            label={item}
            clickable
            sx={{
              borderRadius: 3,
              background: form.interests.includes(item) ? "#c58b5c" : "#eeeeee",
              color: form.interests.includes(item) ? "white" : "#444",
              "&:hover": {
                background: form.interests.includes(item) ? "#b07647" : "#e0e0e0",
              },
            }}
            onClick={() => {
              const updated = form.interests.includes(item)
                ? form.interests.filter((i) => i !== item)
                : [...form.interests, item];
              setForm({ ...form, interests: updated });
            }}
          />
        ))}
      </Box>
    </Box>

    <Button
      type="submit"
      variant="contained"
      size="large"
      disabled={loading}
      sx={{ py: 1.4, fontWeight: "bold", background: "#c58b5c", "&:hover": { background: "#b07647" } }}
    >
      {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "GENERATE ITINERARY"}
    </Button>
  </>
)}

          </Box>
        </Paper>
      </form>
    </Box>
  );
}

export default Planner;