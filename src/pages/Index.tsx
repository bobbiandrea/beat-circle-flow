import { Header } from "@/components/Header";
import { SongCard } from "@/components/SongCard";
import { MusicPlayer } from "@/components/MusicPlayer";
import { YoutubePlayer } from "@/components/YoutubePlayer";
import { Sparkles, Zap, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";
import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import { getRandomSongs, YoutubeSong } from "@/utils/youtubeSongs";

const Index = () => {
  const [currentSong, setCurrentSong] = useState<YoutubeSong | null>(null);
  const [songs, setSongs] = useState<YoutubeSong[]>([]);
  const [activeYoutubePlayer, setActiveYoutubePlayer] = useState<YoutubeSong | null>(null);

  // Album covers for visual variety
  const albumCovers = [album1, album2, album3, album4];

  // Load random songs on component mount
  useEffect(() => {
    const randomSongs = getRandomSongs(12);
    // Assign random album covers to songs
    const songsWithCovers = randomSongs.map((song, index) => ({
      ...song,
      coverUrl: albumCovers[index % albumCovers.length]
    }));
    setSongs(songsWithCovers);
    
    toast.success("🎵 Loaded random songs from YouTube!");
  }, []);

  const handlePlay = (song: YoutubeSong) => {
    setCurrentSong(song);
    setActiveYoutubePlayer(song);
    toast.success(`Now playing: ${song.title} by ${song.artist}`);
  };

  const handleClosePlayer = () => {
    setActiveYoutubePlayer(null);
  };

  return (
    <div className="min-h-screen pb-32">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold">
              Welcome to <span className="gradient-text">JAMS</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Stream music. Support artists. Own the vibe.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The first Web3 music platform on Base where every stream, tip, and NFT puts power back in creators' hands.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Explore Music
              </Button>
              <Button size="lg" variant="outline" className="border-primary/40">
                Mint BeatPass
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="glass-card rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Instant Tipping</h3>
            <p className="text-sm text-muted-foreground">
              Support artists directly with ETH or USDC on Base - fast and low cost
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg">Smart Royalties</h3>
            <p className="text-sm text-muted-foreground">
              Automated on-chain payments ensure creators always get paid fairly
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Own the Music</h3>
            <p className="text-sm text-muted-foreground">
              Collect limited edition BeatPass NFTs and unlock exclusive content
            </p>
          </div>
        </div>
      </section>

      {/* Trending Songs */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trending on Base</h2>
            <p className="text-muted-foreground">Hot tracks from Black Circle artists</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              title={song.title}
              artist={song.artist}
              coverUrl={song.coverUrl}
              duration={song.duration}
              onPlay={() => handlePlay(song)}
            />
          ))}
        </div>
      </section>

      {/* BeatPass CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto glow-hover">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              Join the JAMS Revolution
            </h2>
            <p className="text-lg text-muted-foreground">
              Mint your BeatPass NFT to unlock exclusive drops, early access, and governance rights in the Black Circle ecosystem.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white mt-4"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Mint BeatPass (Coming Soon)
            </Button>
          </div>
        </div>
      </section>

      {/* Music Player */}
      <MusicPlayer currentSong={currentSong} />

      {/* YouTube Player */}
      {activeYoutubePlayer && (
        <YoutubePlayer
          videoId={activeYoutubePlayer.youtubeId}
          title={activeYoutubePlayer.title}
          artist={activeYoutubePlayer.artist}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default Index;
