"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


interface MapPost {
  _id: string;
  caption?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  userName: string;
  isOwn: boolean;
  _creationTime: number;
}

function createIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-pin ${color === "#0d9488" ? "teal" : "orange"}"><div class="inner"></div></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

const tealIcon = createIcon("#0d9488");
const orangeIcon = createIcon("#c2410c");

function FitBounds({ posts }: { posts: MapPost[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (posts.length > 0 && !fitted.current) {
      const bounds = L.latLngBounds(
        posts.map((p) => [p.latitude, p.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      fitted.current = true;
    }
  }, [posts, map]);

  return null;
}

export default function MapView({ posts }: { posts: MapPost[] }) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="h-full w-full"
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <FitBounds posts={posts} />

      {posts.map((post) => (
        <Marker
          key={post._id}
          position={[post.latitude, post.longitude]}
          icon={post.isOwn ? tealIcon : orangeIcon}
        >
          <Popup>
            <div className="w-60">
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="h-36 w-full object-cover rounded-t-lg"
                />
              )}
              <div className="p-3">
                <p className="text-sm font-semibold text-stone-900 line-clamp-2 mb-1">
                  {post.caption}
                </p>
                <div className="flex items-center gap-1 text-xs text-stone-400 mb-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  <span className="line-clamp-1">{post.locationName}</span>
                </div>
                <p className="text-xs text-stone-500">by {post.userName}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
