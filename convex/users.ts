import { v } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";

const ADJECTIVES = [
  "Curious",
  "Sunny",
  "Wandering",
  "Velvet",
  "Lucky",
  "Glowing",
  "Brave",
  "Merry",
  "Cosmic",
  "Golden",
  "Quiet",
  "Zesty",
  "Breezy",
  "Playful",
  "Dreamy",
  "Clever",
  "Dashing",
  "Gentle",
  "Radiant",
  "Spry",
] as const;

const NOUNS = [
  "Otter",
  "Comet",
  "Fox",
  "Heron",
  "Panda",
  "Lynx",
  "Rambler",
  "Sparrow",
  "Kite",
  "Coyote",
  "Robin",
  "Dolphin",
  "Wren",
  "Koala",
  "Voyager",
  "Moose",
  "Falcon",
  "Badger",
  "Firefly",
  "Nomad",
] as const;

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function createAnonymousName() {
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${randomItem(ADJECTIVES)} ${randomItem(NOUNS)} ${suffix}`;
}

async function generateUniqueAnonymousName(ctx: MutationCtx) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const generatedName = createAnonymousName();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_name", (q) => q.eq("name", generatedName))
      .unique();

    if (!existingUser) {
      return generatedName;
    }
  }

  return `Roving Nomad ${Date.now().toString().slice(-6)}`;
}

export const create = mutation({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const requestedName = args.name?.trim();
    if (requestedName) {
      return await ctx.db.insert("users", { name: requestedName });
    }

    const generatedName = await generateUniqueAnonymousName(ctx);
    return await ctx.db.insert("users", { name: generatedName });
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateDisplayName = mutation({
  args: { userId: v.id("users"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { name: args.name });
  },
});

export const assignGeneratedName = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    if (user.name !== "Anonymous") {
      return user.name;
    }

    const generatedName = await generateUniqueAnonymousName(ctx);
    await ctx.db.patch(args.userId, { name: generatedName });
    return generatedName;
  },
});
