import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const bankIcon = new L.Icon({
  iconUrl: "/imgs/bank_icon.png",
  iconSize: [30, 30],
});
const bureauIcon = new L.Icon({
  iconUrl: "/imgs/moneyexchange_icon.png",
  iconSize: [30, 30],
});

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  let isRequestInProgress = false;

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
        node["amenity"="bureau_de_change"](${bbox});
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
  const throttledFetchBankData = throttle(fetchBankData, 2000); // 2 seconds delay

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

  return (<div>
    <MapContainer center={[50.45, 30.52]} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <MapEvents />
      {locations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lon]} 
        icon={location?.tags?.amenity==="bank"?bankIcon:bureauIcon}>
          <Popup>
            <strong>{location.tags.name || ""}</strong><br />
            {location.tags.opening_hours || ""}<br/>
            {location.tags.amenity==="bureau_de_change"?"Money Exchange": ""}<br/>
            {location.tags["addr:street"] || ""} {location.tags["addr:housenumber"] || ""}
          </Popup>
        </Marker>
      ))}
    </MapContainer></div>
  );
};

export default MapComponent;
