"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavBar } from "@/components/NavBar";
import { useIdentity } from "@/components/useIdentity";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
    </div>
  ),
});

export default function MapPage() {
  const { userId } = useIdentity();
  const posts = useQuery(
    api.posts.getAllPostsForMap,
    userId ? { userId } : "skip"
  );

  return (
    <>
      <NavBar />
      <main className="h-screen pb-16 md:pt-16 md:pb-0">
        <div className="h-full relative">
          {posts === undefined ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
            </div>
          ) : (
            <MapView posts={posts} />
          )}

          <div className="absolute top-4 right-4 md:top-auto md:bottom-6 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-stone-200">
            <p className="text-xs font-semibold text-stone-700 mb-2">Markers</p>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-30"></div>
                <div className="relative w-2 h-2 bg-teal-500 rounded-full ring-2 ring-teal-500/20"></div>
              </div>
              <span className="text-xs font-medium text-stone-600">Your posts</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className="absolute inset-0 bg-orange-600 rounded-full animate-ping opacity-30"></div>
                <div className="relative w-2 h-2 bg-orange-600 rounded-full ring-2 ring-orange-600/20"></div>
              </div>
              <span className="text-xs font-medium text-stone-600">Others&apos; posts</span>
            </div>
          </div>

          {posts && posts.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-50/80 z-[999]">
              <div className="text-center px-4">
                <div className="text-6xl mb-4">🗺️</div>
                <h2 className="text-xl font-bold text-stone-900 mb-2">
                  Map is empty
                </h2>
                <p className="text-stone-500">
                  No travel memories yet. Start posting to populate the map!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
