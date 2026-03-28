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
      <main className="min-h-screen pt-24 pb-12 sm:pt-28 sm:pb-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <section className="soft-panel px-6 py-7 md:px-10 md:py-10">
            <p className="section-kicker mb-3">Curated memories</p>
            <div>
              <h1 className="display-title text-[2.7rem] text-stone-900 md:text-[4rem]">
                Global Feed
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 md:text-base">
                Travel memories from around the world, presented with a quieter
                editorial rhythm.
              </p>
            </div>
          </section>

          <div className="py-8">
            {posts === undefined && (
              <div className="soft-panel flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
            )}

            {posts && posts.length === 0 && (
              <div className="soft-panel px-6 py-16 text-center">
                <p className="section-kicker mb-3">First story</p>
                <h2 className="display-title mb-3 text-[2.2rem] text-stone-900">
                  No posts yet
                </h2>
                <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-stone-500">
                  Be the first to share a travel memory!
                </p>
                <Link href="/post/new" className="primary-button">
                  Create your first post
                </Link>
              </div>
            )}

            {posts && posts.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {posts.map((post, i) => (
                    <PostCard key={post._id} {...post} featured={i === 0} />
                  ))}
                </div>

                {status === "CanLoadMore" && (
                  <div className="mt-10 flex justify-center">
                    <button onClick={() => loadMore(12)} className="soft-button px-6">
                      Load more
                    </button>
                  </div>
                )}

                {status === "LoadingMore" && (
                  <div className="mt-10 flex justify-center">
                    <div className="w-6 h-6 border-2 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
