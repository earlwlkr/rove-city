"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavBar } from "@/components/NavBar";
import { PostCard } from "@/components/PostCard";
import { useIdentity } from "@/components/useIdentity";
import Link from "next/link";

export default function ProfilePage() {
  const { userId, user, updateName, isLoading } = useIdentity();
  const posts = useQuery(
    api.posts.getUserPosts,
    userId ? { userId } : "skip"
  );

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setName(user?.name ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateName(name.trim());
      setEditing(false);
    } catch (err) {
      console.error("Failed to update name:", err);
    }
    setSaving(false);
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-24 pb-12 sm:pt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <section className="soft-panel px-6 py-7 md:px-10 md:py-10">
            <div className="flex items-center gap-5">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-2xl font-semibold text-stone-700 md:h-20 md:w-20 md:text-3xl"
              >
                {(user?.name ?? "A").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your display name"
                      className="min-w-0 flex-1 border-b border-stone-300 bg-transparent pb-1 text-xl font-medium text-stone-900 outline-none md:text-2xl"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") setEditing(false);
                      }}
                    />
                    <button
                      onClick={handleSave}
                      disabled={saving || !name.trim()}
                      className="primary-button px-4 py-2 text-xs disabled:opacity-50"
                    >
                      {saving ? "..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="soft-button px-4 py-2 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="section-kicker mb-2">Your profile</p>
                      <h1 className="truncate text-2xl font-medium text-stone-900 md:text-3xl">
                        {user?.name ?? "Traveler"}
                      </h1>
                    </div>
                    <button
                      onClick={startEditing}
                      className="soft-button shrink-0 px-3 py-1.5 text-xs"
                    >
                      Edit name
                    </button>
                  </div>
                )}
                {!editing && (
                  <p className="mt-2 text-sm text-stone-500">
                    {posts?.length ?? 0} travel{" "}
                    {(posts?.length ?? 0) === 1 ? "memory" : "memories"}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="py-8">
            {isLoading || posts === undefined ? (
              <div className="soft-panel flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="soft-panel px-6 py-16 text-center">
                <p className="section-kicker mb-3">Quiet start</p>
                <h2 className="display-title mb-3 text-[2.2rem] text-stone-900">
                  No memories yet
                </h2>
                <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-stone-500">
                  Start capturing your travel moments.
                </p>
                <Link href="/post/new" className="primary-button">
                  Create your first post
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {posts.map((post, i) => (
                  <PostCard
                    key={post._id}
                    {...post}
                    userName={user?.name ?? "Traveler"}
                    featured={i === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
