"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Analyzes a photo using an OpenAI vision model and saves the generated
 * tags and caption back to the post in Convex.
 *
 * Requires OPENAI_API_KEY to be set in Convex environment variables.
 */
export const tagPhoto = action({
  args: {
    postId: v.id("posts"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // 1. Get a temporary URL for the stored image
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      console.error("[AI] Could not get image URL for storageId:", args.storageId);
      return;
    }

    // 2. Call OpenAI vision API
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[AI] OPENAI_API_KEY not set in Convex environment variables");
      return;
    }

    const systemPrompt = `You are a travel photo analyst. 
Given a travel photo, return a JSON object with exactly two fields:
- "caption": A single evocative sentence (max 20 words) describing the scene.
- "tags": An array of 5-8 concise lowercase tags (e.g. "beach", "sunset", "street food").
Respond ONLY with the JSON object, no markdown, no extra text.`;

    let aiCaption: string | undefined;
    let tags: string[] | undefined;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 200,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: { url: imageUrl, detail: "low" },
                },
                {
                  type: "text",
                  text: "Analyze this travel photo and return the JSON.",
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("[AI] OpenAI API error:", response.status, err);
        return;
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? "";

      // Strip possible markdown code fences
      const cleaned = raw.replace(/^```[\w]*\n?/m, "").replace(/\n?```$/m, "").trim();
      const parsed = JSON.parse(cleaned);

      if (typeof parsed.caption === "string") aiCaption = parsed.caption;
      if (Array.isArray(parsed.tags)) {
        tags = parsed.tags
          .filter((t: unknown) => typeof t === "string")
          .map((t: string) => t.toLowerCase().trim())
          .slice(0, 10);
      }
    } catch (err) {
      console.error("[AI] Failed to parse OpenAI response:", err);
      return;
    }

    // 3. Save back to the post
    await ctx.runMutation(api.posts.saveAiTags, {
      postId: args.postId,
      aiCaption,
      tags,
    });

    console.log("[AI] Tagged post", args.postId, "tags:", tags);
  },
});
