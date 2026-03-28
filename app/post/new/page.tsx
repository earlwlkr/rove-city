"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { LocationSearch } from "@/components/LocationSearch";
import { useIdentity } from "@/components/useIdentity";

export default function NewPostPage() {
  const { userId, isLoading } = useIdentity();
  const router = useRouter();
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);
  const tagPhoto = useAction(api.ai.tagPhoto);

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiStatus, setAiStatus] = useState<"idle" | "tagging" | "done" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((f: File | null) => {
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) handleFileChange(f);
    },
    [handleFileChange]
  );

  const resizeImage = useCallback(
    (file: File, maxWidth = 1600): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No canvas context"));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Failed to create blob"));
            },
            "image/jpeg",
            0.85
          );
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !location || !userId) return;

    setSubmitting(true);
    try {
      // 1. Resize and upload the image
      const resized = await resizeImage(file);
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": resized.type },
        body: resized,
      });
      const { storageId } = await result.json();

      // 2. Create the post record
      const postId = await createPost({
        userId,
        caption: caption.trim() || undefined,
        locationName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        storageId,
      });

      // 3. Fire-and-forget AI tagging (non-blocking)
      if (postId) {
        setAiStatus("tagging");
        tagPhoto({ postId, storageId })
          .then(() => setAiStatus("done"))
          .catch((err) => {
            console.error("[AI] Tagging failed:", err);
            setAiStatus("error");
          });
      }

      router.push("/");
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-24 pb-12 sm:pt-28">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <section className="soft-panel px-6 py-7 md:px-10 md:py-10">
            <p className="section-kicker mb-3">Compose a memory</p>
            <h1 className="display-title mb-2 text-[2.5rem] text-stone-900 md:text-[3.6rem]">
              New Travel Memory
            </h1>
            <p className="mb-8 max-w-xl text-sm leading-6 text-stone-500">
              Capture a moment tied to a place, with a lighter and more
              editorial presentation.
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo upload */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                    Photo
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer overflow-hidden rounded-[28px] border border-dashed transition-colors ${
                      preview
                        ? "border-stone-200 bg-white/70"
                        : "border-stone-300 bg-white/55 hover:border-stone-400 hover:bg-white/75"
                    }`}
                  >
                    {preview ? (
                      <div className="relative h-64 md:h-80">
                        <img
                          src={preview}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20">
                          <span className="text-sm font-medium text-white opacity-0 hover:opacity-100">
                            Change photo
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center px-4 py-16">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-stone-200 bg-white/85">
                          <svg
                            className="h-7 w-7 text-stone-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                            />
                          </svg>
                        </div>
                        <p className="mb-1 text-sm font-medium text-stone-700">
                          Drop a photo here or click to browse
                        </p>
                        <p className="text-xs text-stone-400">
                          Images are optimized before upload
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0] ?? null)
                      }
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="What's the story behind this moment?"
                    rows={3}
                    className="soft-input resize-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                    Location
                  </label>
                  <LocationSearch
                    onSelect={setLocation}
                    selectedName={location?.name}
                  />
                </div>

                {/* AI tagging status (visible while tagging is in progress) */}
                {aiStatus === "tagging" && (
                  <p className="flex items-center gap-1.5 text-xs text-teal-700">
                    <span className="inline-block w-3 h-3 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
                    AI is tagging your photo in the background…
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!file || !location || submitting || !userId}
                  className="primary-button w-full rounded-2xl py-3.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publishing...
                    </span>
                  ) : (
                    "Publish Memory"
                  )}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
