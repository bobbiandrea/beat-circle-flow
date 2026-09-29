/**
 * StreakBadge — shows the listener's daily streak, plan and minutes listened.
 */
import { Flame, Crown, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Profile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";

export const StreakBadge = ({ profile }: { profile: Profile | null }) => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm" className="border-primary/40">
        <Link to="/auth">
          <LogIn className="h-4 w-4 mr-1" /> Sign in
        </Link>
      </Button>
    );
  }

  const premium = profile?.subscription_tier === "premium";

  return (
    <div className="flex items-center gap-2">
      <div className="glass-card rounded-full px-3 py-1.5 flex items-center gap-2">
        <Flame className={`h-4 w-4 ${(profile?.listening_streak ?? 0) > 0 ? "text-secondary" : "text-muted-foreground"}`} />
        <span className="text-sm font-semibold">{profile?.listening_streak ?? 0}</span>
        <span className="text-xs text-muted-foreground hidden sm:inline">day streak</span>
        {premium && <Crown className="h-4 w-4 text-primary" />}
      </div>
      <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};
