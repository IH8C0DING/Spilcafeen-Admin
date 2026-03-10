import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Lock, Mail } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center gap-2 justify-center mb-4">
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Spilcaféen" className="h-10 w-auto" />
            <span className="text-xl font-bold">Spilcaféen Admin</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border p-8">
          <form onSubmit={(e) => { e.preventDefault(); navigate("/admin"); }} className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                <div className="pl-12 h-12 rounded-xl bg-muted border flex items-center px-3 text-foreground">
                  admin@spilcafen.com
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                <div className="pl-12 h-12 rounded-xl bg-muted border flex items-center px-3 text-foreground">
                  ••••••••
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-full">
              Sign In
            </Button>
          </form>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t py-4">
        <p className="text-center text-xs text-black">© 2026 Spilcaféen. All rights reserved.</p>
      </footer>
    </div>
  );
}
