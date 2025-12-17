"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

export function DialogModal({ isOpen, isClose }) {
  const supaBase = createClient();
  const handleGoogleLogin = async () => {
    const { origin } = window.location;
    await supaBase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={isClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In to continue</DialogTitle>
          <DialogDescription>
            Track product prices and get alerts on price drops.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
