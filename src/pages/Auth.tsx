/**
 * Auth page — email sign up / sign in so streaks and notifications
 * can be saved to a real account.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in? Go straight to the music.
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back to JAMS");
    navigate("/", { replace: true });
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — your streak starts now");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
            <Music2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">JAMS</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to keep your listening streak and updates.
          </p>
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          {["signin", "signup"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor={`${tab}-email`}>Email</Label>
                <Input
                  id={`${tab}-email`}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-muted/50 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${tab}-password`}>Password</Label>
                <Input
                  id={`${tab}-password`}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-muted/50 border-primary/20"
                />
              </div>
              <Button
                disabled={busy || !email || !password}
                onClick={tab === "signin" ? signIn : signUp}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
              >
                {tab === "signin" ? "Sign in" : "Create account"}
              </Button>
            </TabsContent>
          ))}
        </Tabs>

        <button
          onClick={() => navigate("/")}
          className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
        >
          Keep browsing without an account
        </button>
      </div>
    </div>
  );
};

export default Auth;
