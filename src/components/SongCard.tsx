import { Play, Heart, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface SongCardProps {
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
  onPlay: () => void;
}

export const SongCard = ({ title, artist, coverUrl, duration, onPlay }: SongCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="glass-card rounded-xl p-4 glow-hover group transition-all">
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-muted">
        <img 
          src={coverUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <Button
          variant="default"
          size="icon"
          className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary shadow-lg opacity-0 group-hover:opacity-100 transition-opacity glow-hover"
          onClick={onPlay}
        >
          <Play className="h-5 w-5 ml-0.5" />
        </Button>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold truncate">{title}</h3>
        <p className="text-sm text-muted-foreground truncate">{artist}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">{duration}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-primary text-primary' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
