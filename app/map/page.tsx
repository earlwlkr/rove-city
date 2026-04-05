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
