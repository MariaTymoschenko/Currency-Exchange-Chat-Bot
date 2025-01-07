import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

let isRequestInProgress = false;

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  // Fetch data from Overpass API
  const fetchBankData = async (bounds) => {
    if (isRequestInProgress) return; // Prevent overlapping requests
    setLoading(true);
    isRequestInProgress = true;
    const { _southWest, _northEast } = bounds;
    const bbox = `${_southWest.lat}, ${_southWest.lng}, ${_northEast.lat}, ${_northEast.lng}`;
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="bank"](${bbox});
        node["amenity"="bureau_de_change"](${bbox}); // Include currency exchange
      );
      out body;
    `;

    try {
        console.log(new Date());
      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "text/plain" } }
      );
      setLocations(response.data.elements);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      isRequestInProgress = false;
      setLoading(false);
    }
  };

  // Custom throttle function
  const throttle = (func, wait) => {
    return function (...args) {
      const now = Date.now();
      const timeSinceLastCall = now - lastRequestTime;

      if (timeSinceLastCall >= wait) {
        setLastRequestTime(now);
        func(...args); // Call the function if enough time has passed
      }
    };
  };

  // Apply throttle to the fetchBankData function
  const throttledFetchBankData = throttle(fetchBankData, 5000); // 2 seconds delay

  const MapEvents = () => {
    const map = useMapEvents({
      moveend: () => {
        const bounds = map.getBounds();
        throttledFetchBankData(bounds); // Trigger throttled fetch on map move
      },
    });

    useEffect(() => {
      // Fetch data on initial load
      const bounds = map.getBounds();
      throttledFetchBankData(bounds);
    }, []);

    return null;
  };

  return (
    <MapContainer center={[50.45, 30.52]} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <MapEvents />
      {locations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lon]}>
          <Popup>
            <strong>{location.tags?.name || "Unknown Name"}</strong><br />
            Type: {location.tags?.amenity || "N/A"}
          </Popup>
        </Marker>
      ))}
      {loading && <p style={{ color: "red" }}>Loading...</p>}
    </MapContainer>
  );
};

export default MapComponent;
