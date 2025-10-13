import { Music2, Search } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { Input } from "./ui/input";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 glass-card border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Music2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">JAMS</h1>
              <p className="text-xs text-muted-foreground">Black Circle</p>
            </div>
          </div>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search songs, artists..." 
                className="pl-10 bg-muted/50 border-primary/20"
              />
            </div>
          </div>

          {/* Wallet Connect */}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};
