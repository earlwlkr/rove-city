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
      <main className="h-screen">
        <div className="relative h-full w-full overflow-hidden">
          {posts === undefined ? (
            <div className="flex h-full items-center justify-center">
              <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
            </div>
          ) : (
            <MapView posts={posts} />
          )}

          <div className="soft-card absolute left-4 top-20 z-[1000] px-4 py-3 sm:top-24 md:left-6 md:top-6">
            <p className="section-kicker mb-2">Spatial view</p>
            <h1 className="display-title text-[2rem] text-stone-900 md:text-[2.8rem]">
              World Map
            </h1>
          </div>

          <div className="soft-card absolute right-4 top-20 z-[1000] px-4 py-3 sm:top-24 md:right-6 md:top-6 md:bottom-auto">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
              Markers
            </p>
            <div className="mb-2 flex items-center gap-2.5">
              <div className="relative flex h-3 w-3 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-teal-500 opacity-30 animate-ping"></div>
                <div className="relative h-2 w-2 rounded-full bg-teal-500 ring-2 ring-teal-500/20"></div>
              </div>
              <span className="text-xs font-medium text-stone-600">Your posts</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-3 w-3 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-orange-600 opacity-30 animate-ping"></div>
                <div className="relative h-2 w-2 rounded-full bg-orange-600 ring-2 ring-orange-600/20"></div>
              </div>
              <span className="text-xs font-medium text-stone-600">Others&apos; posts</span>
            </div>
          </div>

          {posts && posts.length === 0 && (
            <div className="absolute inset-0 z-[999] flex items-center justify-center bg-stone-50/70 backdrop-blur-sm">
              <div className="soft-card px-8 py-10 text-center">
                <p className="section-kicker mb-3">Waiting for stories</p>
                <h2 className="display-title mb-3 text-[2.2rem] text-stone-900">
                  Map is empty
                </h2>
                <p className="max-w-sm text-sm leading-6 text-stone-500">
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
