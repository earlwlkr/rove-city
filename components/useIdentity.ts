"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Id } from "@/convex/_generated/dataModel";

const USER_ID_KEY = "rove-user-id";
let pendingUserCreation: Promise<Id<"users">> | null = null;

function getStoredUserId(): Id<"users"> | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY) as Id<"users"> | null;
}

function setStoredUserId(id: Id<"users">) {
  localStorage.setItem(USER_ID_KEY, id);
}

function clearStoredUserId() {
  localStorage.removeItem(USER_ID_KEY);
}

export function useIdentity() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const createUser = useMutation(api.users.create);
  const updateNameMutation = useMutation(api.users.updateDisplayName);
  const assignGeneratedName = useMutation(api.users.assignGeneratedName);
  const user = useQuery(api.users.getUser, userId ? { userId } : "skip");
  const renamingRef = useRef(false);

  const ensureUser = useCallback(async () => {
    const stored = getStoredUserId();
    if (stored) {
      setUserId(stored);
      return stored;
    }

    if (!pendingUserCreation) {
      pendingUserCreation = createUser({})
        .then((id) => {
          setStoredUserId(id);
          return id;
        })
        .finally(() => {
          pendingUserCreation = null;
        });
    }

    const id = await pendingUserCreation;
    setUserId(id);
    return id;
  }, [createUser]);

  useEffect(() => {
    ensureUser().catch((err) => {
      console.error("Failed to initialize identity:", err);
    });
  }, [ensureUser]);

  // If stored ID points to a deleted user, create a new one
  useEffect(() => {
    if (userId && user === null) {
      clearStoredUserId();
      setUserId(null);
      ensureUser().catch((err) => {
        console.error("Failed to recover identity:", err);
      });
    }
  }, [userId, user, ensureUser]);

  useEffect(() => {
    if (!userId || user?.name !== "Anonymous" || renamingRef.current) {
      return;
    }

    renamingRef.current = true;
    assignGeneratedName({ userId }).finally(() => {
      renamingRef.current = false;
    });
  }, [userId, user?.name, assignGeneratedName]);

  const updateName = useCallback(
    async (name: string) => {
      if (!userId) return;
      await updateNameMutation({ userId, name });
    },
    [userId, updateNameMutation]
  );

  return { userId, user, updateName, isLoading: userId === null || user === undefined };
}
