"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Id } from "@/convex/_generated/dataModel";

const USER_ID_KEY = "rove-user-id";

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
  const user = useQuery(api.users.getUser, userId ? { userId } : "skip");
  const creatingRef = useRef(false);

  useEffect(() => {
    const stored = getStoredUserId();
    if (stored) {
      setUserId(stored);
    } else if (!creatingRef.current) {
      creatingRef.current = true;
      createUser({ name: "Anonymous" }).then((id) => {
        setStoredUserId(id);
        setUserId(id);
      });
    }
  }, [createUser]);

  // If stored ID points to a deleted user, create a new one
  useEffect(() => {
    if (userId && user === null && !creatingRef.current) {
      creatingRef.current = true;
      clearStoredUserId();
      createUser({ name: "Anonymous" }).then((id) => {
        setStoredUserId(id);
        setUserId(id);
      });
    }
  }, [userId, user, createUser]);

  const updateName = useCallback(
    async (name: string) => {
      if (!userId) return;
      await updateNameMutation({ userId, name });
    },
    [userId, updateNameMutation]
  );

  return { userId, user, updateName, isLoading: userId === null || user === undefined };
}
