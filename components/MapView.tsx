"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PostCard } from "./PostCard";

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

function FitBounds({ posts }: { posts: MapPost[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (posts.length > 0 && !fitted.current) {
      const bounds = L.latLngBounds(
        posts.map((p) => [p.latitude, p.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      fitted.current = true;
    }
  }, [posts, map]);

  return null;
}

function PostMarker({ post }: { post: MapPost }) {
  const icon = useMemo(() => {
    const isOwn = post.isOwn;
    const accentColor = isOwn ? "bg-teal-500" : "bg-orange-600";
    const ringColor = isOwn ? "ring-teal-500/20" : "ring-orange-600/20";
    const shadowColor = isOwn ? "shadow-teal-500/30" : "shadow-orange-600/30";

    let html = '';
    
    if (post.imageUrl) {
      html = `
        <div class="relative group cursor-pointer w-[48px] h-[58px]">
          <!-- Ambient Glow -->
          <div class="absolute top-[24px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 ${accentColor} rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
          
          <!-- Marker Body -->
          <div class="absolute top-0 left-0 w-[48px] h-[48px] rounded-[18px] sm:rounded-full border-[3px] border-white bg-white shadow-xl ring-4 ${ringColor} transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 z-10 ${shadowColor} overflow-hidden">
            <img src="${post.imageUrl}" class="w-full h-full object-cover" alt="Memory" />
          </div>
          
          <!-- Dynamic Pointer -->
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-white z-0 transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"></div>
        </div>
      `;
      return L.divIcon({
        className: "bg-transparent border-none",
        html,
        iconSize: [48, 58],
        iconAnchor: [24, 58], 
        popupAnchor: [0, -56], 
      });
    } else {
      html = `
        <div class="relative group cursor-pointer w-8 h-8 flex items-center justify-center">
          <!-- Pulse layer -->
          <div class="absolute inset-0 ${accentColor} rounded-full animate-ping opacity-30"></div>
          
          <!-- Center dot -->
          <div class="relative w-5 h-5 ${accentColor} rounded-full border-[3px] border-white shadow-[0_4px_8px_rgba(0,0,0,0.12)] flex items-center justify-center ring-[3px] ${ringColor} group-hover:scale-125 transition-transform duration-300 z-10">
          </div>
        </div>
      `;
      return L.divIcon({
        className: "bg-transparent border-none",
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    }
  }, [post.imageUrl, post.isOwn]);

  return (
    <Marker position={[post.latitude, post.longitude]} icon={icon}>
      <Popup className="premium-popup">
        <div className="w-[280px]">
          <PostCard
            _id={post._id}
            caption={post.caption}
            locationName={post.locationName}
            latitude={post.latitude}
            longitude={post.longitude}
            imageUrl={post.imageUrl}
            userName={post.userName}
            _creationTime={post._creationTime}
          />
        </div>
      </Popup>
    </Marker>
  );
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
        <PostMarker key={post._id} post={post} />
      ))}
    </MapContainer>
  );
}
