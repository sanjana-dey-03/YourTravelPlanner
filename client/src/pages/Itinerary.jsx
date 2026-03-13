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
  const navigate = useNavigate();

  const topRef = useRef(null);
  const pdfRef = useRef(null);

  const [days, setDays] = useState([]);
  const [tripInfo, setTripInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

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

        setDays(
          Array.isArray(res.data.itinerary)
            ? res.data.itinerary
            : []
        );

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
      hotel: {
        name: value,
        address: value,
      },
    };

    setDays(updatedDays);

    try {

      await API.patch(
        `/trip/${tripInfo._id}/day/${updatedDays[index].day}/hotel`,
        { hotel: value }
      );

    } catch (err) {

      console.error("Failed to save hotel", err);

    }
  };

  useEffect(() => {

    topRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [index]);

  const nextDay = () => {

    if (index < days.length - 1) {
      setIndex((i) => i + 1);
    }

  };

  const prevDay = () => {

    if (index > 0) {
      setIndex((i) => i - 1);
    }

  };

  const downloadPDF = async () => {

    if (!pdfRef.current || !tripInfo) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();

    const pageHeight =
      (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pageWidth,
      pageHeight
    );

    pdf.save(`${tripInfo.destination}-itinerary.pdf`);
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
      case "morning":
        return <WbSunnyIcon fontSize="small" />;
      case "late morning":
        return <Brightness5Icon fontSize="small" />;
      case "afternoon":
        return <AccessTimeIcon fontSize="small" />;
      case "evening":
        return <WbTwilightIcon fontSize="small" />;
      case "night":
        return <NightsStayIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {

    switch (type) {
      case "temple":
        return <AccountBalanceIcon fontSize="small" />;
      case "museum":
        return <MuseumIcon fontSize="small" />;
      case "food":
        return <RestaurantIcon fontSize="small" />;
      case "nature":
        return <ParkIcon fontSize="small" />;
      case "market":
        return <StorefrontIcon fontSize="small" />;
      default:
        return <PlaceIcon fontSize="small" />;
    }
  };

  if (loading) {

    return (
      <Box sx={{ textAlign: "center", mt: 20 }}>
        <Typography variant="h5">
          Loading your trip...
        </Typography>
      </Box>
    );

  }

  return (

    <Box
      ref={topRef}
      sx={{
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >

      {/* HERO */}

      <Box
        sx={{
          height: 280,
          position: "relative",
          backgroundImage: `url(${tripInfo?.image || itineraryBg})`,
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
            p: 5,
          }}
        >

          <Box color="white">

            <Typography variant="h4" fontWeight="bold">
              {tripInfo?.destination}
            </Typography>

            <Typography>
              {tripInfo?.days} Days • ₹{tripInfo?.budget}
            </Typography>

          </Box>

        </Box>

      </Box>

      {/* CONTENT */}

      <Box sx={{ maxWidth: 950, mx: "auto", mt: 6, px: 2 }}>

        {/* BUTTONS */}

        <Box
          sx={{
            position: "fixed",
            top: 16,
            right: 24,
            zIndex: 1300,
            display: "flex",
            gap: 1,
          }}
        >

          <Button
            variant="contained"
            onClick={() => navigate("/dashboard")}
            sx={{ background: "#c58b5c" }}
          >
            DASHBOARD
          </Button>

          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ background: "#c58b5c" }}
          >
            LOGOUT
          </Button>

          <Button
            variant="contained"
            onClick={copyShareLink}
            sx={{ background: "#c58b5c" }}
          >
            SHARE
          </Button>

          <Button
            variant="contained"
            onClick={downloadPDF}
            sx={{ background: "#c58b5c" }}
          >
            DOWNLOAD PDF
          </Button>

        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
        >
          Here's Your Day-wise Itinerary
        </Typography>

        {/* DAY NAV */}

        <Box
          display="flex"
          justifyContent="space-between"
          mb={4}
        >

          <Button
            variant="contained"
            onClick={prevDay}
            disabled={index === 0}
            sx={{ background: "#c58b5c" }}
          >
            ← Previous
          </Button>

          <Typography fontWeight={600}>
            Day {index + 1} / {days.length}
          </Typography>

          <Button
            variant="contained"
            onClick={nextDay}
            disabled={index === days.length - 1}
            sx={{ background: "#c58b5c" }}
          >
            Next →
          </Button>

        </Box>

        {/* DAY CARD */}

        <AnimatePresence mode="wait">

          <motion.div
            key={index}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >

            <Card sx={{ borderRadius: 5 }}>

              <CardContent>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  mb={4}
                >
                  Day {index + 1} Plan
                </Typography>

                {days[index]?.places?.map((p, i) => {

                  const place = normalizePlace(p);

                  return (

                    <Box key={i} mb={3}>

                      <Typography fontWeight={700}>
                        {place.name}
                      </Typography>

                      <Typography color="text.secondary">
                        {place.description}
                      </Typography>

                    </Box>

                  );

                })}

                <Divider sx={{ my: 4 }} />

                <Typography fontWeight={700}>
                  Where are you staying?
                </Typography>

                <input
                  type="text"
                  placeholder="Hotel / Hostel / Airbnb"
                  value={days[index]?.hotel?.name || ""}
                  onChange={(e) =>
                    handleHotelChange(e.target.value)
                  }
                />

                {days[index]?.hotel?.name && (
                  <DayRouteMap
                    hotel={days[index].hotel.name}
                    places={days[index].places}
                  />
                )}

              </CardContent>

            </Card>

          </motion.div>

        </AnimatePresence>

      </Box>

      {/* HIDDEN FULL ITINERARY FOR PDF */}

      <Box
        ref={pdfRef}
        sx={{
          position: "absolute",
          left: "-9999px",
          width: 900,
          background: "white",
          padding: 4,
        }}
      >

        <Typography variant="h4" mb={4}>
          {tripInfo.destination} Travel Plan
        </Typography>

        {days.map((day, dIndex) => (

          <Box key={dIndex} mb={4}>

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              Day {dIndex + 1}
            </Typography>

            {day.places.map((p, i) => {

              const place = normalizePlace(p);

              return (

                <Box key={i} mb={2}>

                  <Typography fontWeight={700}>
                    {place.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {place.description}
                  </Typography>

                </Box>

              );

            })}

          </Box>

        ))}

      </Box>

    </Box>
  );
}

export default Itinerary;