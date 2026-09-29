/**
 * NotificationsBell — updates, links and new-artist alerts for the signed-in listener.
 * Reads from the database and lets the listener mark items as read.
 */
import { useCallback, useEffect, useState } from "react";
import { Bell, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link_url: string | null;
  is_read: boolean | null;
  created_at: string | null;
}

export const NotificationsBell = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);

  const load = useCallback(async () => {
    if (!user) return setItems([]);
    const { data } = await supabase
      .from("notifications")
      .select("id, type, title, message, link_url, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setItems((data as Notification[]) ?? []);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // Live updates as new notifications arrive
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, load]);

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unread = items.filter((n) => !n.is_read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-secondary text-[10px] font-bold text-background flex items-center justify-center">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 glass-card border-primary/20 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
          <span className="font-semibold text-sm">Updates</span>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-secondary hover:underline">
              Mark all read
            </button>
          )}
        </div>

        <ScrollArea className="max-h-80">
          {!user && (
            <p className="p-4 text-sm text-muted-foreground">
              Sign in to get drop alerts and artist updates.
            </p>
          )}
          {user && items.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No updates yet — check back soon.</p>
          )}
          {items.map((n) => (
            <div
              key={n.id}
              className={`px-4 py-3 border-b border-primary/5 space-y-1 ${n.is_read ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{n.title}</p>
                {!n.is_read && <span className="mt-1 w-2 h-2 rounded-full bg-secondary shrink-0" />}
              </div>
              {n.message && <p className="text-xs text-muted-foreground">{n.message}</p>}
              {n.link_url && (
                <a
                  href={n.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-secondary hover:underline"
                >
                  Open link <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
