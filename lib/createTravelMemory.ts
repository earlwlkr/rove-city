import type { Id } from "@/convex/_generated/dataModel";

export type ImageSource =
  | { kind: "file"; file: File }
  | { kind: "url"; url: string };

export interface TravelMemoryLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface CreateTravelMemoryArgs {
  userId: Id<"users">;
  caption?: string;
  location: TravelMemoryLocation;
  imageSource: ImageSource;
}

export interface CreateTravelMemoryDependencies {
  generateUploadUrl: () => Promise<string>;
  createPost: (args: {
    userId: Id<"users">;
    caption?: string;
    locationName: string;
    latitude: number;
    longitude: number;
    storageId: Id<"_storage">;
  }) => Promise<Id<"posts">>;
}

async function resizeFile(file: File, maxWidth = 1600): Promise<Blob> {
  if (typeof window === "undefined") {
    return file;
  }

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
        0.85,
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function fetchUrlAsBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image URL: ${response.status} ${response.statusText}`);
  }

  return await response.blob();
}

async function resolveImageBlob(source: ImageSource): Promise<Blob> {
  if (source.kind === "url") {
    return await fetchUrlAsBlob(source.url);
  }

  return await resizeFile(source.file);
}

export async function createTravelMemory(
  deps: CreateTravelMemoryDependencies,
  args: CreateTravelMemoryArgs,
): Promise<{ postId: Id<"posts">; storageId: Id<"_storage"> }> {
  const blob = await resolveImageBlob(args.imageSource);
  const uploadUrl = await deps.generateUploadUrl();

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": blob.type || "application/octet-stream",
    },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Image upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
  }

  const uploadResult = (await uploadResponse.json()) as { storageId?: string };
  if (!uploadResult.storageId) {
    throw new Error("Image upload did not return a storageId");
  }

  const storageId = uploadResult.storageId as Id<"_storage">;
  const postId = await deps.createPost({
    userId: args.userId,
    caption: args.caption?.trim() || undefined,
    locationName: args.location.name,
    latitude: args.location.latitude,
    longitude: args.location.longitude,
    storageId,
  });

  return { postId, storageId };
}
