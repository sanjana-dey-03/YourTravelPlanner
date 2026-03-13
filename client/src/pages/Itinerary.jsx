import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MuseumIcon from "@mui/icons-material/Museum";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ParkIcon from "@mui/icons-material/Park";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PlaceIcon from "@mui/icons-material/Place";

import itineraryBg from "../assets/itinerary.jpg";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DayRouteMap from "../components/DayRouteMap";

function Itinerary() {
  const { id } = useParams();
  const topRef = useRef(null);
  const pdfRef = useRef(null);

  const [days, setDays] = useState([]);
  const [tripInfo, setTripInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const copyShareLink = () => {
    if (!tripInfo?.shareId) return;
    const link = `${window.location.origin}/shared/${tripInfo.shareId}`;
    navigator.clipboard.writeText(link);
    alert("Share link copied!");
  };

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await API.get(`/trip/${id}`);
        setTripInfo(res.data);
        setDays(Array.isArray(res.data.itinerary) ? res.data.itinerary : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleHotelChange = async (value) => {
    const updatedDays = [...days];
    updatedDays[index] = {
      ...updatedDays[index],
      hotel: { name: value, address: value },
    };
    setDays(updatedDays);

    try {
      await API.patch(`/trip/${tripInfo._id}/day/${updatedDays[index].day}/hotel`, { hotel: value });
    } catch (err) {
      console.error("Failed to save hotel", err);
    }
  };

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [index]);

  const nextDay = () => index < days.length - 1 && setIndex((i) => i + 1);
  const prevDay = () => index > 0 && setIndex((i) => i - 1);

  const downloadPDF = async () => {
    if (!pdfRef.current || !tripInfo) return;
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save(`${tripInfo.destination}-trip.pdf`);
  };

  const normalizePlace = (place) => {
    if (typeof place === "string") {
      return {
        name: place,
        description: `Explore ${place} during your trip.`,
        bestTime: "",
        duration: "",
        travelTip: "Check local timings before visiting.",
        type: "landmark",
      };
    }
    return place;
  };

  const getTimeIcon = (time) => {
    switch (time) {
      case "morning": return <WbSunnyIcon fontSize="small" />;
      case "late morning": return <Brightness5Icon fontSize="small" />;
      case "afternoon": return <AccessTimeIcon fontSize="small" />;
      case "evening": return <WbTwilightIcon fontSize="small" />;
      case "night": return <NightsStayIcon fontSize="small" />;
      default: return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "temple": return <AccountBalanceIcon fontSize="small" />;
      case "museum": return <MuseumIcon fontSize="small" />;
      case "food": return <RestaurantIcon fontSize="small" />;
      case "nature": return <ParkIcon fontSize="small" />;
      case "market": return <StorefrontIcon fontSize="small" />;
      default: return <PlaceIcon fontSize="small" />;
    }
  };

  if (loading) {
    return <Box sx={{ textAlign: "center", mt: 20 }}><Typography variant="h5">Loading your trip...</Typography></Box>;
  }

  return (
    <Box ref={topRef} sx={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Box sx={{ height: 280, position: "relative", backgroundImage: `url(${tripInfo?.image || itineraryBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.65))", display: "flex", alignItems: "flex-end", p: 5 }}>
          <Box color="white">
            <Typography variant="h4" fontWeight="bold">{tripInfo?.destination}</Typography>
            <Typography>{tripInfo?.days} Days • ₹{tripInfo?.budget}</Typography>
          </Box>
        </Box>
      </Box>

      <Box ref={pdfRef} sx={{ maxWidth: 950, mx: "auto", mt: 6, px: 2 }}>
        <Box sx={{ position: "fixed", top: 16, right: 24, zIndex: 1300, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ background: "#c58b5c", boxShadow: "0 6px 16px rgba(197,139,92,0.35)", "&:hover": { background: "#b27749" } }}
          >
            DASHBOARD
          </Button>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ background: "#c58b5c", boxShadow: "0 6px 16px rgba(197,139,92,0.35)", "&:hover": { background: "#a9683f" } }}
          >
            LOGOUT
          </Button>
          <Button
            variant="contained"
            onClick={copyShareLink}
            sx={{ background: "#c58b5c", boxShadow: "0 6px 16px rgba(197,139,92,0.35)", "&:hover": { background: "#b27749" } }}
          >
            SHARE
          </Button>
          <Button onClick={downloadPDF} variant="contained" sx={{ background: "#c58b5c" }}>
            DOWNLOAD PDF
          </Button>
        </Box>

        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>Here's Your Day-wise Itinerary</Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Button variant="contained" onClick={prevDay} disabled={index === 0} sx={{ background: "#c58b5c", borderRadius: "25px", px: 3 }}>← Previous</Button>
          <Typography fontWeight={600}>Day {index + 1} / {days.length}</Typography>
          <Button variant="contained" onClick={nextDay} disabled={index === days.length - 1} sx={{ background: "#c58b5c", borderRadius: "25px", px: 3 }}>Next →</Button>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}>
            <Card sx={{ borderRadius: 5, p: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={4}>Day {index + 1} Plan</Typography>

                <Box sx={{ position: "relative", ml: 2 }}>
                  <Box sx={{ position: "absolute", left: 9, top: 12, bottom: 12, width: 2, background: "linear-gradient(to bottom, #e7d4c4, #d9b89c)", borderRadius: 2, opacity: 0.6 }} />

                  {days[index]?.places?.map((p, i) => {
                    const place = normalizePlace(p);
                    return (
                      <Box key={i} sx={{ position: "relative", pl: 4, mb: 5, pb: 4, "&:not(:last-child)": { borderBottom: "1px dashed rgba(197,139,92,0.35)" } }}>
                        <Box sx={{ position: "absolute", left: -2, top: 4, width: 20, height: 20, borderRadius: "50%", background: "white", border: "4px solid #c58b5c", boxShadow: "0 4px 10px rgba(197,139,92,0.35)" }} />

                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 0.4, mb: 1, borderRadius: "12px", background: "#f6efe9", color: "#9a6a43", fontSize: 13, fontWeight: 500 }}>
                          {getTimeIcon(place.timeOfDay)}
                          {place.timeOfDay && place.timeOfDay}
                          {place.bestTime && ` • ${place.bestTime}`}
                          {place.duration && ` • ${place.duration}`}
                          <Box sx={{ ml: 1 }}>{getTypeIcon(place.type)}</Box>
                        </Box>

                        <Typography fontWeight={700} fontSize={18} mb={1}>{place.name}</Typography>
                        <Typography color="text.secondary" mb={1}>{place.description}</Typography>
                        <Typography fontSize={13} sx={{ background: "#fff4ea", display: "inline-block", px: 1.5, py: 0.5, borderRadius: "12px", color: "#b07647" }}>💡 {place.travelTip}</Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography fontWeight={700} color="#c58b5c" mb={2}>🏨 Where are you staying?</Typography>
                <Box display="flex" justifyContent="center">
                  <Box sx={{ width: "70%" }}>
                    <input type="text" placeholder="Enter hotel / hostel / Airbnb" value={days[index]?.hotel?.name || ""} onChange={(e) => handleHotelChange(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "25px", border: "1px solid #c58b5c", outline: "none", background: "#fffaf5", fontSize: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} />
                  </Box>
                </Box>

                {days[index]?.hotel?.name && <Box mt={4}><DayRouteMap hotel={days[index].hotel.name} places={days[index].places} /></Box>}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default Itinerary;
