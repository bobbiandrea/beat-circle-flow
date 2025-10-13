import { useEffect, useRef, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";

interface YoutubePlayerProps {
  videoId: string;
  title: string;
  artist: string;
  onClose: () => void;
}

export const YoutubePlayer = ({ videoId, title, artist, onClose }: YoutubePlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Load YouTube iframe API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  return (
    <div 
      className={`fixed ${isFullscreen ? 'inset-0' : 'bottom-24 right-4'} z-50 transition-all duration-300`}
      style={{ width: isFullscreen ? '100%' : '400px', height: isFullscreen ? '100%' : '300px' }}
    >
      <div className="glass-card rounded-lg overflow-hidden h-full flex flex-col border border-primary/20">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-primary/20">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground truncate">{artist}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* YouTube Player */}
        <div className="flex-1 bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
            title={`${title} - ${artist}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
