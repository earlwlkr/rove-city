"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
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

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
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
      const resized = await resizeImage(file);
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": resized.type },
        body: resized,
      });
      const { storageId } = await result.json();

      await createPost({
        userId,
        caption: caption.trim() || undefined,
        locationName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        storageId,
      });

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
      <main className="min-h-screen pb-20 md:pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-1">
            New Travel Memory
          </h1>
          <p className="text-stone-500 mb-8">
            Capture a moment tied to a place
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-stone-200 border-t-teal-500 rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo upload */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Photo
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-colors overflow-hidden ${
                    preview
                      ? "border-stone-200"
                      : "border-stone-300 hover:border-teal-400 hover:bg-teal-50/30"
                  }`}
                >
                  {preview ? (
                    <div className="relative h-64 md:h-80">
                      <img
                        src={preview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 hover:opacity-100 font-medium text-sm">
                          Change photo
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-stone-400"
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
                      <p className="text-sm font-medium text-stone-700 mb-1">
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
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's the story behind this moment?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Location
                </label>
                <LocationSearch
                  onSelect={setLocation}
                  selectedName={location?.name}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  !file || !location || submitting || !userId
                }
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: "var(--teal)" }}
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
        </div>
      </main>
    </>
  );
}
