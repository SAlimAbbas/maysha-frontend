"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery<User | null>({
    queryKey: ["authMe"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return null;
        const json = await res.json();
        return json.user || null;
      } catch {
        return null;
      }
    },
    staleTime: 60 * 1000,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.setQueryData(["authMe"], null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    user: userQuery.data ?? null,
    isLoading: userQuery.isLoading,
    isAuthenticated: Boolean(userQuery.data),
    logout: logoutMutation.mutateAsync,
    refetchUser: userQuery.refetch,
  };
}
