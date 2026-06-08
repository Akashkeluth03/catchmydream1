"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues in Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const mapMarkers = [
  {
    name: "USA",
    lat: 37.0902,
    lng: -95.7129,
    universities: 4000,
    scholarships: "Many fully funded",
  },
  {
    name: "Canada",
    lat: 56.1304,
    lng: -106.3468,
    universities: 100,
    scholarships: "Research grants available",
  },
  {
    name: "United Kingdom",
    lat: 55.3781,
    lng: -3.436,
    universities: 160,
    scholarships: "Chevening, Commonwealth",
  },
  {
    name: "Australia",
    lat: -25.2744,
    lng: 133.7751,
    universities: 43,
    scholarships: "Endeavour Scholarships",
  },
  {
    name: "Germany",
    lat: 51.1657,
    lng: 10.4515,
    universities: 380,
    scholarships: "DAAD Scholarships",
  },
];

export default function StudyMap() {
  return (
    <div className="w-full h-[500px] sm:h-[600px] rounded-2xl overflow-hidden shadow-lg border border-zinc-200 z-0">
      <MapContainer
        center={[20.5937, 78.9629]} // India Coordinates
        zoom={3} // Zoomed out slightly to show the world
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapMarkers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>
              <div className="text-center font-sans">
                <h3 className="font-bold text-indigo-600 text-lg">{marker.name}</h3>
                <p className="m-0 mt-1 text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-800">Universities:</span>{" "}
                  {marker.universities.toLocaleString()}+
                </p>
                <p className="m-0 mt-1 text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-800">Scholarships:</span>{" "}
                  {marker.scholarships}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
