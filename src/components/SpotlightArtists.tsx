/**
 * SpotlightArtists — shows the artists currently in the spotlight.
 * Reads from the database; falls back to a small demo line-up if empty.
 */
import { useEffect, useState } from "react";
import { Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface SpotlightArtist {
  id: string;
  name: string;
  bio: string | null;
  platform: string | null;
  total_listeners: number | null;
  avatar_url: string | null;
}

/** Shown when no artists exist in the database yet. */
const demoArtists: SpotlightArtist[] = [
  {
    id: "demo-1",
    name: "Nova Mbeki",
    bio: "Amapiano-meets-electronica producer signed to Black Circle.",
    platform: "sound.xyz",
    total_listeners: 4820,
    avatar_url: null,
  },
  {
    id: "demo-2",
    name: "KweziWave",
    bio: "Afro-soul singer turning live sessions into onchain collectibles.",
    platform: "catalog",
    total_listeners: 3610,
    avatar_url: null,
  },
  {
    id: "demo-3",
    name: "Dust & Circuits",
    bio: "Lo-fi duo releasing weekly beat drops for BeatPass holders.",
    platform: "boomplay",
    total_listeners: 2740,
    avatar_url: null,
  },
];

export const SpotlightArtists = () => {
  const [artists, setArtists] = useState<SpotlightArtist[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Spotlighted first, then the most-listened rising artists
      const { data } = await supabase
        .from("artists")
        .select("id, name, bio, platform, total_listeners, avatar_url")
        .order("is_spotlighted", { ascending: false })
        .order("total_listeners", { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        setArtists(data as SpotlightArtist[]);
      } else {
        setArtists(demoArtists);
        setIsDemo(true);
      }
    };
    load();
  }, []);

  if (artists.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5 text-secondary" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Artist Spotlight</h2>
          <p className="text-sm text-muted-foreground">
            {isDemo
              ? "Sample line-up — real artists appear here as they join"
              : "Rising artists automatically featured this week"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {artists.map((artist) => (
          <div key={artist.id} className="glass-card rounded-xl p-5 space-y-3 glow-hover">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {artist.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{artist.name}</h3>
                {artist.platform && (
                  <p className="text-xs text-muted-foreground capitalize">{artist.platform}</p>
                )}
              </div>
            </div>
            {artist.bio && <p className="text-sm text-muted-foreground">{artist.bio}</p>}
            <div className="flex items-center gap-1 text-xs text-secondary">
              <Users className="h-3 w-3" />
              {(artist.total_listeners ?? 0).toLocaleString()} listeners
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
