"use client";

import { formatDistanceToNow } from "./utils";

interface PostCardProps {
  _id: string;
  caption?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  userName: string;
  userImage?: string;
  _creationTime: number;
  featured?: boolean;
}

export function PostCard({
  caption,
  locationName,
  imageUrl,
  userName,
  _creationTime,
  featured = false,
}: PostCardProps) {
  return (
    <article
      className={`soft-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(28,25,23,0.08)] ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {imageUrl && (
        <div
          className={`relative overflow-hidden ${
            featured ? "h-64 md:h-80" : "h-48"
          }`}
        >
          <img
            src={imageUrl}
            alt={caption}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/10 via-transparent to-transparent" />
        </div>
      )}
      <div className="p-4 md:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-[11px] font-semibold text-stone-700"
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-stone-900">
              {userName}
            </div>
            <div className="text-[11px] text-stone-400">
              {formatDistanceToNow(_creationTime)}
            </div>
          </div>
        </div>

        {caption && (
          <div
            className={`mb-3 leading-relaxed text-stone-700 ${
              featured ? "text-[15px]" : "text-sm"
            }`}
          >
            {caption}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
          <svg
            className="w-3.5 h-3.5 shrink-0"
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
          <span className="truncate">{locationName}</span>
        </div>
      </div>
    </article>
  );
}
