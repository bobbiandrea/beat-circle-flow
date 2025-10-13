import { Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  const handleConnect = async () => {
    // TODO: Integrate Base MiniKit SDK
    // For now, simulate connection
    setIsConnected(true);
    setAddress("0x742d...4a9c");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
  };

  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      className={isConnected ? "border-primary/40" : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"}
      onClick={isConnected ? handleDisconnect : handleConnect}
    >
      <Wallet className="h-4 w-4 mr-2" />
      {isConnected ? address : "Connect Wallet"}
    </Button>
  );
};
