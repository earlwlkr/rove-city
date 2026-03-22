"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostCard } from "@/components/PostCard";
import { NavBar } from "@/components/NavBar";
import { useIdentity } from "@/components/useIdentity";
import Link from "next/link";

export default function FeedPage() {
  const { userId } = useIdentity();
  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.getFeed,
    userId ? { userId } : "skip",
    { initialNumItems: 12 }
  );

  return (
    <>
      <NavBar />
      <main className="min-h-screen pb-20 md:pt-20 md:pb-8">
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900">
                Global Feed
              </h1>
              <p className="text-stone-500 mt-2 text-base md:text-lg">
                Travel memories from around the world
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {posts === undefined && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
            </div>
          )}

          {posts && posts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">
                No posts yet
              </h2>
              <p className="text-stone-500 mb-6">
                Be the first to share a travel memory!
              </p>
              <Link
                href="/post/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
                style={{ background: "var(--teal)" }}
              >
                Create your first post
              </Link>
            </div>
          )}

          {posts && posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {posts.map((post, i) => (
                  <PostCard key={post._id} {...post} featured={i === 0} />
                ))}
              </div>

              {status === "CanLoadMore" && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => loadMore(12)}
                    className="px-6 py-3 rounded-full text-sm font-semibold text-stone-700 border border-stone-300 hover:bg-stone-100 transition-colors"
                  >
                    Load more
                  </button>
                </div>
              )}

              {status === "LoadingMore" && (
                <div className="flex justify-center mt-10">
                  <div className="w-6 h-6 border-2 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
