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
      <main className="min-h-screen pb-20 md:pt-20">
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold shrink-0"
                style={{ background: "var(--teal)" }}
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
                      className="text-xl md:text-2xl font-bold text-stone-900 bg-transparent border-b-2 border-teal-500 outline-none pb-1 flex-1 min-w-0"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") setEditing(false);
                      }}
                    />
                    <button
                      onClick={handleSave}
                      disabled={saving || !name.trim()}
                      className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                      style={{ background: "var(--teal)" }}
                    >
                      {saving ? "..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-1.5 rounded-lg text-sm font-semibold text-stone-500 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-stone-900 truncate">
                      {user?.name ?? "Traveler"}
                    </h1>
                    <button
                      onClick={startEditing}
                      className="text-xs px-3 py-1 rounded-full border border-stone-300 text-stone-500 hover:text-stone-700 hover:border-stone-400 transition-colors shrink-0"
                    >
                      Edit name
                    </button>
                  </div>
                )}
                <p className="text-stone-500 text-sm mt-1">
                  {posts?.length ?? 0} travel{" "}
                  {(posts?.length ?? 0) === 1 ? "memory" : "memories"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {isLoading || posts === undefined ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">
                No memories yet
              </h2>
              <p className="text-stone-500 mb-6">
                Start capturing your travel moments
              </p>
              <Link
                href="/post/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
                style={{ background: "var(--teal)" }}
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
      </main>
    </>
  );
}
