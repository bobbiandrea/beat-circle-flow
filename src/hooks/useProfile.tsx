/**
 * useProfile — loads the signed-in listener's profile (streak, minutes, plan)
 * and records listening activity so the streak grows day by day.
 */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  username: string | null;
  wallet_address: string | null;
  subscription_tier: "free" | "premium";
  listening_streak: number;
  total_listening_time: number;
}

/** UTC calendar day, used to decide if a streak continues or resets. */
const dayOf = (iso: string) => new Date(iso).toISOString().slice(0, 10);
const todayKey = () => new Date().toISOString().slice(0, 10);

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, username, wallet_address, subscription_tier, listening_streak, total_listening_time")
      .eq("id", user.id)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Saves one play to the listening history, then updates the streak:
   * played yesterday -> +1, gap of more than a day -> back to 1.
   */
  const recordPlay = useCallback(
    async (song: { title: string; artist: string; platform?: string }, durationSeconds = 30) => {
      if (!user) return;

      // Most recent play before this one (used for the streak maths)
      const { data: last } = await supabase
        .from("listening_sessions")
        .select("started_at")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      await supabase.from("listening_sessions").insert({
        user_id: user.id,
        song_title: song.title,
        artist_name: song.artist,
        platform: song.platform ?? "youtube",
        duration_seconds: durationSeconds,
        ended_at: new Date().toISOString(),
      });

      const current = profile?.listening_streak ?? 0;
      let streak = 1;
      if (last?.started_at) {
        const lastDay = dayOf(last.started_at as string);
        const today = todayKey();
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
        if (lastDay === today) streak = Math.max(current, 1);
        else if (lastDay === yesterday) streak = current + 1;
      }

      const totalTime = (profile?.total_listening_time ?? 0) + durationSeconds;

      const { data: updated } = await supabase
        .from("profiles")
        .update({ listening_streak: streak, total_listening_time: totalTime })
        .eq("id", user.id)
        .select("id, username, wallet_address, subscription_tier, listening_streak, total_listening_time")
        .maybeSingle();

      if (updated) setProfile(updated as Profile);
      return { streak, grew: streak > current };
    },
    [user, profile]
  );

  return { profile, loading, reload: load, recordPlay };
};
