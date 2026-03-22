"use client";

import Image from "next/image";
import { formatDistanceToNow } from "./utils";

interface PostCardProps {
  _id: string;
  caption: string;
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
      className={`bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-shadow duration-300 ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {imageUrl && (
        <div
          className={`relative overflow-hidden ${
            featured ? "h-64 md:h-80" : "h-48"
          }`}
        >
          <Image
            src={imageUrl}
            alt={caption}
            fill
            className="object-cover"
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        </div>
      )}
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "var(--teal)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-stone-400">
              {formatDistanceToNow(_creationTime)}
            </p>
          </div>
        </div>

        <p
          className={`text-stone-700 leading-relaxed mb-3 ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {caption}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-stone-400">
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
