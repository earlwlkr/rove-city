"use node";

import { generateText, Output } from "ai";
import { v } from "convex/values";
import { z } from "zod";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { getGatewayModelId, getGatewayStructuredModel } from "../lib/ai-gateway";

/**
 * Analyzes a photo using Vercel AI Gateway and saves the generated
 * tags and caption back to the post in Convex.
 *
 * Requires AI_GATEWAY_API_KEY to be set in Convex environment variables.
 */
export const tagPhoto = action({
  args: {
    postId: v.id("posts"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      console.error("[AI] Could not get image URL for storageId:", args.storageId);
      return;
    }

    if (!process.env.AI_GATEWAY_API_KEY) {
      console.error("[AI] AI_GATEWAY_API_KEY not set in Convex environment variables");
      return;
    }

    const model = getGatewayModelId();
    const photoAnalysisSchema = z.object({
      caption: z.string().trim().min(1).max(140),
      tags: z.array(z.string().trim().min(1).max(32)).min(5).max(8),
    });

    let aiCaption: string | undefined;
    let tags: string[] | undefined;

    try {
      const result = await generateText({
        model: getGatewayStructuredModel(model),
        maxOutputTokens: 300,
        messages: [
          {
            role: "system",
            content: `You are a travel photo analyst.
Given a travel photo, return exactly one caption and 5 to 8 concise lowercase tags.
Keep the caption evocative and short. Return strict JSON only.`,
          },
          {
            role: "user",
            content: [
              {
                type: "image",
                image: imageUrl,
              },
              {
                type: "text",
                text: "Analyze this travel photo and describe the place and mood.",
              },
            ],
          },
        ],
        output: Output.object({
          schema: photoAnalysisSchema,
          name: "travel_photo_analysis",
          description: "Caption and tags for a travel photo.",
        }),
      });

      aiCaption = result.output.caption;
      tags = result.output.tags.map((tag) => tag.toLowerCase().trim()).slice(0, 10);
    } catch (err) {
      console.error("[AI] Failed to generate gateway response:", err);
      return;
    }

    await ctx.runMutation(api.posts.saveAiTags, {
      postId: args.postId,
      aiCaption,
      tags,
    });

    console.log("[AI] Tagged post", args.postId, "model:", model, "tags:", tags);
  },
});
