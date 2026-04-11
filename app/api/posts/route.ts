import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createTravelMemory } from "@/lib/createTravelMemory";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: Request) {
  if (!convexUrl) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_CONVEX_URL" }, { status: 500 });
  }

  try {
    const body = (await request.json()) as {
      userId?: string;
      caption?: string;
      locationName?: string;
      latitude?: number;
      longitude?: number;
      imageUrl?: string;
    };

    const { userId, caption, locationName, latitude, longitude, imageUrl } = body;

    if (
      !userId ||
      !locationName ||
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !imageUrl
    ) {
      return NextResponse.json(
        {
          error: "userId, locationName, latitude, longitude, and imageUrl are required",
        },
        { status: 400 },
      );
    }

    const convex = new ConvexHttpClient(convexUrl);

    const { postId, storageId } = await createTravelMemory(
      {
        generateUploadUrl: () => convex.mutation(api.posts.generateUploadUrl, {}),
        createPost: (args) => convex.mutation(api.posts.createPost, args),
      },
      {
        userId,
        caption,
        location: { name: locationName, latitude, longitude },
        imageSource: { kind: "url", url: imageUrl },
      },
    );

    await convex.action(api.ai.tagPhoto, { postId, storageId });

    return NextResponse.json({ ok: true, postId }, { status: 201 });
  } catch (error) {
    console.error("[api/posts] Failed to create post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 500 },
    );
  }
}
