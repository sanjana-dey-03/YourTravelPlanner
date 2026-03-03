import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "16px",
};

export default function DayRouteMap({ hotel, places }) {
  const [directions, setDirections] = useState(null);

  if (!hotel || !places?.length) return null;

  const origin = hotel;
  const destination = places[places.length - 1];

  const waypoints = places.slice(0, -1).map((place) => ({
    location: place,
    stopover: true,
  }));

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 20.5937, lng: 78.9629 }}
        zoom={5}
      >
        {!directions && (
          <DirectionsService
            options={{
              origin,
              destination,
              waypoints,
              travelMode: "DRIVING",
            }}
            callback={(result) => {
              if (result !== null && result.status === "OK") {
                setDirections(result);
              }
            }}
          />
        )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}