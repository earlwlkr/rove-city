"use client";

import { useEffect, useRef, useMemo } from "react";
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
        <div className="w-[280px] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden font-sans">
          {post.imageUrl ? (
            <div className="relative h-44 w-full">
              <img
                src={post.imageUrl}
                alt={post.caption || 'Memory location'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <p className="text-white font-medium text-[15px] leading-snug drop-shadow-md line-clamp-2">
                  {post.caption || "A beautiful memory"}
                </p>
              </div>
            </div>
          ) : (
             <div className="p-4 bg-gradient-to-br from-stone-50 to-stone-100">
                <p className="text-stone-800 font-medium text-[15px] leading-snug mb-2">
                  {post.caption || "A beautiful memory"}
                </p>
             </div>
          )}
          
          <div className="p-4 bg-white/95">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 min-w-[20px] h-5 rounded-full bg-stone-100/80 flex items-center justify-center text-stone-500 shadow-sm border border-stone-200/50">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-stone-800 leading-tight flex-1">{post.locationName}</span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-stone-100/80">
                <div className="flex items-center gap-2">
                  <div className="w-[22px] h-[22px] rounded-full bg-stone-800 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {post.userName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-[13px] font-medium text-stone-600">{post.userName}</p>
                </div>
                <span className="text-[11px] font-bold text-stone-400/80 uppercase tracking-widest bg-stone-50 px-2 py-0.5 rounded-sm">
                  {new Date(post._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
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
