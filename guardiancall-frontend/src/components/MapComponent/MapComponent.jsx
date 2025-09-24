import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent({ areaCenter = [-1.286389, 36.817223], zoom = 12 }) {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer center={areaCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={areaCenter}>
          <Popup>📍 Selected Area</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
