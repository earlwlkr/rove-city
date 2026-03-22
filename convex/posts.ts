import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPost = mutation({
  args: {
    userId: v.id("users"),
    caption: v.string(),
    locationName: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", args);
  },
});

export const getFeed = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .paginate({ numItems: limit, cursor: args.cursor ?? null });

    const enriched = await Promise.all(
      posts.page.map(async (post) => {
        const user = await ctx.db.get(post.userId);
        const imageUrl = await ctx.storage.getUrl(post.storageId);
        return {
          ...post,
          userName: user?.name ?? "Anonymous",
          imageUrl,
          isOwn: args.userId ? post.userId === args.userId : false,
        };
      })
    );

    return { ...posts, page: enriched };
  },
});

export const getUserPosts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);

    return Promise.all(
      posts.map(async (post) => {
        const imageUrl = await ctx.storage.getUrl(post.storageId);
        return { ...post, imageUrl };
      })
    );
  },
});

export const getAllPostsForMap = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const posts = await ctx.db.query("posts").order("desc").take(500);

    return Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.userId);
        const imageUrl = await ctx.storage.getUrl(post.storageId);
        return {
          _id: post._id,
          caption: post.caption,
          locationName: post.locationName,
          latitude: post.latitude,
          longitude: post.longitude,
          imageUrl,
          userName: user?.name ?? "Anonymous",
          isOwn: args.userId ? post.userId === args.userId : false,
          _creationTime: post._creationTime,
        };
      })
    );
  },
});
