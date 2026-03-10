import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Dice5, Users, Bell, LogOut, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const navItems = [
  { path: "/admin", label: "Board Games", icon: Dice5 },
  { path: "/admin/users", label: "Users", icon: Users },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("Aarhus-Vestergade");

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Spilcaféen" className="h-10 w-auto" />
            <span className="text-xl font-bold">Spilcaféen Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2">
              <Bell className="w-5 h-5 fill-primary text-primary" />
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="h-10 rounded-full w-52">
                <MapPin className="w-4 h-4 mr-1 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aarhus-Vestergade">Aarhus - Vestergade</SelectItem>
                <SelectItem value="Aarhus-Fredensgade">Aarhus - Fredensgade</SelectItem>
                <SelectItem value="Aalborg">Aalborg</SelectItem>
                <SelectItem value="Kolding">Kolding</SelectItem>
                <SelectItem value="Odense">Odense</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
              <span className="text-sm">Admin</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-black"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t py-4">
        <p className="text-center text-xs text-black">© 2026 Spilcaféen. All rights reserved.</p>
      </footer>
    </div>
  );
}
