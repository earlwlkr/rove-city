"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useCallback } from "react";
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
  const [userId, setUserId] = useState<Id<"users"> | null>(() =>
    getStoredUserId()
  );
  const createUser = useMutation(api.users.create);
  const updateNameMutation = useMutation(api.users.updateDisplayName);
  const user = useQuery(api.users.getUser, userId ? { userId } : "skip");

  const ensureUser = useCallback(async () => {
    const current = getStoredUserId();
    if (current) {
      return current;
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
    if (userId) return;

    let cancelled = false;

    ensureUser()
      .then((id) => {
        if (!cancelled) {
          setUserId(id);
        }
      })
      .catch((err) => {
        console.error("Failed to initialize identity:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, ensureUser]);

  // If stored ID points to a deleted user, create a new one
  useEffect(() => {
    if (!userId || user !== null) return;

    let cancelled = false;

    const recoverIdentity = async () => {
      clearStoredUserId();
      const id = await ensureUser();
      if (!cancelled) {
        setUserId(id);
      }
    };

    recoverIdentity().catch((err) => {
      console.error("Failed to recover identity:", err);
    });

    return () => {
      cancelled = true;
    };
  }, [userId, user, ensureUser]);

  const updateName = useCallback(
    async (name: string) => {
      if (!userId) return;
      await updateNameMutation({ userId, name });
    },
    [userId, updateNameMutation]
  );

  return {
    userId,
    user,
    updateName,
    isLoading: userId === null || user === undefined,
  };
}
