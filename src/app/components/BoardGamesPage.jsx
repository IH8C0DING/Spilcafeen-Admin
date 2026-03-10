import { useState, useEffect } from "react";
import { Search, Filter, Plus, Star, Users, Clock, Baby, Globe, MapPin, Pencil, Trash2, Info, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const predefinedCategories = ["Adventure", "Build & Plan", "Card Strategy", "Cooperative", "Family", "Legacy", "Logic", "Party", "Skill & Reflex", "Strategy", "Team Play", "War Games"];

const emptyForm = { name: "", players: "", age: "", playTime: "", rating: 0, shelfLocation: "", creator: "", year: "", publisher: "", category: "", language: "", rules: "", description: "" };

const parsePlayersMin = (s) => { const m = s.match(/\d+/); return m ? parseInt(m[0]) : 0; };
const parsePlayersMax = (s) => { const m = s.match(/(\d+)(?:-(\d+))?/); return m ? parseInt(m[2] || m[1]) : 0; };
const parsePlayTimeMax = (s) => { const nums = s.match(/\d+/g); return nums ? parseInt(nums[nums.length - 1]) : 0; };
const parsePlayTimeMin = (s) => { const m = s.match(/\d+/); return m ? parseInt(m[0]) : 0; };
const parseAge = (s) => parseInt(s) || 0;

const initialGames = [
  { id: "1", name: "Catan", players: "3-4", age: "10+", playTime: "60-120 min", rating: 4, shelfLocation: "A1", creator: "Klaus Teuber", year: "1995", publisher: "Kosmos", category: "Strategy", language: "ENG", rules: "Players collect and trade resources to build roads, settlements, and cities. First to 10 victory points wins.", description: "A classic strategy game where players trade and build to settle the island of Catan." },
  { id: "2", name: "Ticket to Ride", players: "2-5", age: "8+", playTime: "30-60 min", rating: 5, shelfLocation: "A2", creator: "Alan R. Moon", year: "2004", publisher: "Days of Wonder", category: "Family", language: "ENG", rules: "Collect train cards to claim railway routes. Complete destination tickets for bonus points.", description: "A cross-country train adventure where players collect cards to claim railway routes." },
  { id: "3", name: "Pandemic", players: "2-4", age: "8+", playTime: "45 min", rating: 4, shelfLocation: "B2", creator: "Matt Leacock", year: "2008", publisher: "Z-Man Games", category: "Cooperative", language: "ENG", rules: "Players work together to treat infections and find cures for four diseases before they spread.", description: "A cooperative game where players work as a team to stop global disease outbreaks." },
];

export function BoardGamesPage() {
  const [games, setGames] = useState(() => {
    const stored = localStorage.getItem("games");
    return stored ? JSON.parse(stored) : initialGames;
  });

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [playersFilter, setPlayersFilter] = useState("");
  const [playTimeFilter, setPlayTimeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  const hasActiveFilters =
    ratingFilter !== "" || playersFilter !== "" || playTimeFilter !== "" ||
    ageFilter !== "" || categoryFilter !== "" || languageFilter !== "";

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [overlayGame, setOverlayGame] = useState(null);

  const filteredGames = games.filter((g) => {
    if (!g.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (ratingFilter !== "" && g.rating !== parseInt(ratingFilter)) return false;
    if (languageFilter !== "" && g.language !== languageFilter) return false;
    if (categoryFilter !== "" && g.category !== categoryFilter) return false;
    if (playersFilter !== "") {
      const pMin = parsePlayersMin(g.players);
      const pMax = parsePlayersMax(g.players);
      if (playersFilter === "2" && (pMin > 2 || pMax < 2)) return false;
      if (playersFilter === "2-4" && (pMin > 4 || pMax < 2)) return false;
      if (playersFilter === "2-6" && (pMin > 6 || pMax < 2)) return false;
      if (playersFilter === "6+" && pMax < 6) return false;
    }
    if (playTimeFilter !== "") {
      const tMin = parsePlayTimeMin(g.playTime);
      const tMax = parsePlayTimeMax(g.playTime);
      if (playTimeFilter === "<30" && tMin >= 30) return false;
      if (playTimeFilter === "<60" && tMin >= 60) return false;
      if (playTimeFilter === "60+" && tMax < 60) return false;
    }
    if (ageFilter !== "") {
      const a = parseAge(g.age);
      if (ageFilter === "6+" && a > 6) return false;
      if (ageFilter === "10+" && a > 10) return false;
      if (ageFilter === "14+" && a > 14) return false;
      if (ageFilter === "18+" && a > 18) return false;
    }
    return true;
  });

  const field = (key, value) => setFormData((f) => ({ ...f, [key]: value }));

  const handleAddGame = () => {
    setGames([...games, { id: Date.now().toString(), ...formData }]);
    setIsAddDialogOpen(false);
    setFormData(emptyForm);
  };

  const handleEditGame = () => {
    setGames(games.map((g) => g.id === selectedGame.id ? { ...selectedGame, ...formData } : g));
    setIsEditDialogOpen(false);
    setSelectedGame(null);
    setFormData(emptyForm);
  };

  const handleDeleteGame = () => {
    setGames(games.filter((g) => g.id !== selectedGame.id));
    setIsDeleteDialogOpen(false);
    setSelectedGame(null);
  };

  const openEditDialog = (game) => {
    setSelectedGame(game);
    const { id: _, ...rest } = game;
    setFormData(rest);
    setIsEditDialogOpen(true);
  };

  const clearFilters = () => {
    setRatingFilter("");
    setPlayersFilter("");
    setPlayTimeFilter("");
    setAgeFilter("");
    setCategoryFilter("");
    setLanguageFilter("");
  };

  return (
    <div className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-1">Board Games</h1>
          <p className="text-black text-sm">Manage your board game collection</p>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              <Input
                placeholder="Find a game"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-10 rounded-full"
              />
            </div>
            <Button size="lg" className="rounded-full" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Game
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-black shrink-0" />
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger style={{width: "140px"}} className="h-9 rounded-full shrink-0">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ratings</SelectItem>
                <SelectItem value="1">★ 1</SelectItem>
                <SelectItem value="2">★★ 2</SelectItem>
                <SelectItem value="3">★★★ 3</SelectItem>
                <SelectItem value="4">★★★★ 4</SelectItem>
                <SelectItem value="5">★★★★★ 5</SelectItem>
              </SelectContent>
            </Select>
            <Select value={playersFilter} onValueChange={setPlayersFilter}>
              <SelectTrigger style={{width: "140px"}} className="h-9 rounded-full shrink-0">
                <SelectValue placeholder="Players" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Players</SelectItem>
                <SelectItem value="2">2 players</SelectItem>
                <SelectItem value="2-4">Up to 4 players</SelectItem>
                <SelectItem value="2-6">Up to 6 players</SelectItem>
                <SelectItem value="6+">6+ players</SelectItem>
              </SelectContent>
            </Select>
            <Select value={playTimeFilter} onValueChange={setPlayTimeFilter}>
              <SelectTrigger style={{width: "140px"}} className="h-9 rounded-full shrink-0">
                <SelectValue placeholder="Play Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Times</SelectItem>
                <SelectItem value="<30">&lt;30 min</SelectItem>
                <SelectItem value="<60">&lt;60 min</SelectItem>
                <SelectItem value="60+">60+ min</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger style={{width: "140px"}} className="h-9 rounded-full shrink-0">
                <SelectValue placeholder="Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ages</SelectItem>
                <SelectItem value="6+">6+</SelectItem>
                <SelectItem value="10+">10+</SelectItem>
                <SelectItem value="14+">14+</SelectItem>
                <SelectItem value="18+">18+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger style={{width: "140px"}} className="h-9 rounded-full shrink-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {predefinedCategories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger style={{width: "140px"}} className="h-9 rounded-full shrink-0">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Languages</SelectItem>
                <SelectItem value="ENG">ENG</SelectItem>
                <SelectItem value="DK">DK</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-full h-9 px-4 text-xs shrink-0">
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.length === 0 ? (
            <div className="col-span-full text-center py-12"><p className="text-black">No games found</p></div>
          ) : filteredGames.map((game) => (
            <div key={game.id} className="bg-card rounded-2xl shadow-sm border overflow-hidden">
              <div className="h-48 bg-secondary/30 flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}images/missing.png`} alt="No cover" className="h-24 w-24 object-contain opacity-30" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3>{game.name}</h3>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= game.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />)}
                  </div>
                </div>
                <div className="mb-3 p-4 bg-secondary/30 rounded-xl space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card rounded-xl p-3 text-center"><Users className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Players</div><div className="text-sm font-medium">{game.players}</div></div>
                    <div className="bg-card rounded-xl p-3 text-center"><Clock className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Time</div><div className="text-sm font-medium">{game.playTime}</div></div>
                    <div className="bg-card rounded-xl p-3 text-center"><Baby className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Age</div><div className="text-sm font-medium">{game.age}</div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card rounded-xl p-3 text-center"><Globe className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Language</div><div className="text-sm font-medium">{game.language || "—"}</div></div>
                    <div className="bg-card rounded-xl p-3 text-center"><MapPin className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Shelf</div><div className="text-sm font-medium">{game.shelfLocation}</div></div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Button size="sm" onClick={() => setOverlayGame(game)} className="rounded-full px-4">View Details</Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(game)} className="rounded-full h-8 w-8 p-0"><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedGame(game); setIsDeleteDialogOpen(true); }} className="rounded-full h-8 w-8 p-0 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {overlayGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setOverlayGame(null)}>
            <div className="bg-card shadow-xl border w-full max-w-6xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-48 bg-secondary/30 flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}images/missing.png`} alt="No cover" className="h-24 w-24 object-contain opacity-30" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="font-bold">{overlayGame.name}</h2>
                  <div className="flex items-center gap-0.5">{[1,2,3,4,5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= overlayGame.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />)}</div>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card rounded-xl p-3 text-center"><Users className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Players</div><div className="text-sm font-medium">{overlayGame.players}</div></div>
                    <div className="bg-card rounded-xl p-3 text-center"><Clock className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Time</div><div className="text-sm font-medium">{overlayGame.playTime}</div></div>
                    <div className="bg-card rounded-xl p-3 text-center"><Baby className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Age</div><div className="text-sm font-medium">{overlayGame.age}</div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card rounded-xl p-3 text-center"><Globe className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Language</div><div className="text-sm font-medium">{overlayGame.language || "—"}</div></div>
                    <div className="bg-card rounded-xl p-3 text-center"><MapPin className="w-5 h-5 mx-auto mb-1 text-black" /><div className="text-xs text-black">Shelf</div><div className="text-sm font-medium">{overlayGame.shelfLocation}</div></div>
                  </div>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3"><Info className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Game Description</span></div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><div className="text-xs text-black">Creator</div><div className="text-sm font-medium">{overlayGame.creator}</div></div>
                    <div><div className="text-xs text-black">Year</div><div className="text-sm font-medium">{overlayGame.year}</div></div>
                    <div><div className="text-xs text-black">Publisher</div><div className="text-sm font-medium">{overlayGame.publisher}</div></div>
                    <div><div className="text-xs text-black">Category</div><div className="text-sm font-medium">{overlayGame.category}</div></div>
                  </div>
                  <p className="text-sm text-black leading-relaxed">{overlayGame.description}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3"><BookOpen className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Game Rules</span></div>
                  <p className="text-sm text-black leading-relaxed">{overlayGame.rules}</p>
                </div>
                <Button className="w-full rounded-full" onClick={() => setOverlayGame(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Board Game</DialogTitle>
              <DialogDescription>Add a new board game to your collection</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Catan" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Players</Label><Input value={formData.players} onChange={(e) => field("players", e.target.value)} placeholder="e.g. 2-4" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Age</Label><Input value={formData.age} onChange={(e) => field("age", e.target.value)} placeholder="e.g. 8+" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Play Time</Label><Input value={formData.playTime} onChange={(e) => field("playTime", e.target.value)} placeholder="e.g. 30-60 min" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Rating (1-5)</Label><Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => field("rating", parseInt(e.target.value))} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Shelf Location</Label><Input value={formData.shelfLocation} onChange={(e) => field("shelfLocation", e.target.value)} placeholder="e.g. A1" className="rounded-xl" /></div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={formData.language} onValueChange={(v) => field("language", v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select language" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENG">ENG</SelectItem>
                    <SelectItem value="DK">DK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => field("category", v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {predefinedCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Creator</Label><Input value={formData.creator} onChange={(e) => field("creator", e.target.value)} placeholder="Enter creator name" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Year</Label><Input value={formData.year} onChange={(e) => field("year", e.target.value)} placeholder="e.g. 2005" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Publisher</Label><Input value={formData.publisher} onChange={(e) => field("publisher", e.target.value)} placeholder="Enter publisher" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={(e) => field("description", e.target.value)} placeholder="Short description" className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Rules</Label><Input value={formData.rules} onChange={(e) => field("rules", e.target.value)} placeholder="Short rules summary" className="rounded-xl" /></div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <Button type="button" className="w-full rounded-xl border-dashed border-2 h-12" variant="outline">
                  Upload Cover Image
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setFormData(emptyForm); }} className="rounded-full">Cancel</Button>
              <Button onClick={handleAddGame} className="rounded-full">Add Game</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Board Game</DialogTitle>
              <DialogDescription>Update the board game details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => field("name", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Players</Label><Input value={formData.players} onChange={(e) => field("players", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Age</Label><Input value={formData.age} onChange={(e) => field("age", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Play Time</Label><Input value={formData.playTime} onChange={(e) => field("playTime", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Rating (1-5)</Label><Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => field("rating", parseInt(e.target.value))} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Shelf Location</Label><Input value={formData.shelfLocation} onChange={(e) => field("shelfLocation", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Language</Label><Select value={formData.language} onValueChange={(v) => field("language", v)}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ENG">ENG</SelectItem><SelectItem value="DK">DK</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Category</Label><Select value={formData.category} onValueChange={(v) => field("category", v)}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{predefinedCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Creator</Label><Input value={formData.creator} onChange={(e) => field("creator", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Year</Label><Input value={formData.year} onChange={(e) => field("year", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Publisher</Label><Input value={formData.publisher} onChange={(e) => field("publisher", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={(e) => field("description", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2"><Label>Rules</Label><Input value={formData.rules} onChange={(e) => field("rules", e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <Button type="button" className="w-full rounded-xl border-dashed border-2 h-12" variant="outline">
                  Upload Cover Image
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedGame(null); setFormData(emptyForm); }} className="rounded-full">Cancel</Button>
              <Button onClick={handleEditGame} className="rounded-full">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete "{selectedGame?.name}" from your collection.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedGame(null)} className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteGame} className="bg-destructive text-destructive-foreground rounded-full">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
