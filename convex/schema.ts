import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  posts: defineTable({
    userId: v.id("users"),
    caption: v.optional(v.string()),
    locationName: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    storageId: v.id("_storage"),
    // AI-generated fields (populated asynchronously after upload)
    aiCaption: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }).index("by_user", ["userId"]),
});
