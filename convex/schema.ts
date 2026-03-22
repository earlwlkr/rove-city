import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
  }),

  posts: defineTable({
    userId: v.id("users"),
    caption: v.string(),
    locationName: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    storageId: v.id("_storage"),
  }).index("by_user", ["userId"]),
});
