import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Mail, Shield, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";

const initialUsers = [
  { id: "1", name: "John Smith",   email: "john.smith@example.com", role: "Admin",   status: "Active",   joinedDate: "2024-01-15" },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@example.com",   role: "User",    status: "Active",   joinedDate: "2024-02-20" },
  { id: "3", name: "Mike Wilson",   email: "mike.w@example.com",    role: "Manager", status: "Active",   joinedDate: "2024-03-01" },
];

const emptyForm = {
  name: "",
  email: "",
  role: "User",
  status: "Active",
  joinedDate: new Date().toISOString().split("T")[0],
};

export function UsersPage() {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : initialUsers;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setUsers([...users, { id: Date.now().toString(), ...formData }]);
    setIsAddDialogOpen(false);
    setFormData(emptyForm);
  };

  const handleEditUser = () => {
    setUsers(users.map((u) => (u.id === selectedUser.id ? { ...selectedUser, ...formData } : u)));
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setFormData(emptyForm);
  };

  const handleDeleteUser = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    const { id: _, ...rest } = user;
    setFormData(rest);
    setIsEditDialogOpen(true);
  };

  const field = (key, value) => setFormData((f) => ({ ...f, [key]: value }));

  return (
    <div className="p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-1">Users</h1>
          <p className="text-black text-sm">Manage user accounts and permissions</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-10 rounded-full"
            />
          </div>
          <div className="w-48">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-10 rounded-full">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="rounded-full">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-black">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-card rounded-2xl shadow-sm border p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-medium">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 truncate">{user.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-black mb-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Role</span>
                    <Badge variant={user.role === "Admin" ? "default" : "secondary"} className="rounded-full">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Status</span>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"} className="rounded-full">
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Joined</span>
                    <span className="text-sm">{new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(user)} className="rounded-full h-8 w-8 p-0"><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedUser(user); setIsDeleteDialogOpen(true); }} className="rounded-full h-8 w-8 p-0 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => field("name", e.target.value)} placeholder="Enter full name" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={formData.email} onChange={(e) => field("email", e.target.value)} placeholder="Enter email address" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(v) => field("role", v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => field("status", v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinedDate">Joined Date</Label>
                <Input id="joinedDate" type="date" value={formData.joinedDate} onChange={(e) => field("joinedDate", e.target.value)} className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setFormData(emptyForm); }} className="rounded-full">Cancel</Button>
              <Button onClick={handleAddUser} className="rounded-full">Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user account details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => field("name", e.target.value)} placeholder="Enter full name" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" value={formData.email} onChange={(e) => field("email", e.target.value)} placeholder="Enter email address" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(v) => field("role", v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => field("status", v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-joinedDate">Joined Date</Label>
                <Input id="edit-joinedDate" type="date" value={formData.joinedDate} onChange={(e) => field("joinedDate", e.target.value)} className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedUser(null); setFormData(emptyForm); }} className="rounded-full">Cancel</Button>
              <Button onClick={handleEditUser} className="rounded-full">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the account for "{selectedUser?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedUser(null)} className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground rounded-full">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
