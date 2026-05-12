"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";
import { memberService } from "@/services/memberService";
import { uploadImage } from "@/services/aboutService";
import { TeamMember, MemberType, memberTypeLabels } from "@/types/member";
import {
  Plus, Edit, Trash2, Mail, Search, X, GraduationCap, Upload,
} from "lucide-react";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", profilePhoto: "", phone: "",
    memberType: "STUDENT" as MemberType, role: "", institution: "",
    expertise: "", achievements: "", highlights: "", status: "ACTIVE",
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadImage(file);
      const url = res.data?.[0]?.url || "";
      if (url) setForm(f => ({ ...f, profilePhoto: url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadImage(file);
      const url = res.data?.[0]?.url || "";
      if (url) setForm(f => ({ ...f, profilePhoto: url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await memberService.getAllMembers({ search });
      setMembers(res.data);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", profilePhoto: "", phone: "", memberType: "STUDENT", role: "", institution: "", expertise: "", achievements: "", highlights: "", status: "ACTIVE" });
    setIsOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      name: m.name, email: m.email || "", profilePhoto: m.profilePhoto || "",
      phone: m.phone || "", memberType: m.memberType, role: m.role || "",
      institution: m.institution || "", expertise: m.expertise.join(", "),
      achievements: m.achievements.join(", "), highlights: m.highlights || "",
      status: m.status,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        ...form,
        expertise: form.expertise.split(",").map(s => s.trim()).filter(Boolean),
        achievements: form.achievements.split(",").map(s => s.trim()).filter(Boolean),
      };
      if (editing) {
        await memberService.updateMember(editing.id, data);
        toast.success("Member updated");
      } else {
        await memberService.createMember(data as any);
        toast.success("Member created");
      }
      setIsOpen(false);
      fetchMembers();
    } catch {
      toast.error("Failed to save member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this member?")) return;
    try {
      await memberService.deleteMember(id);
      toast.success("Member deleted");
      fetchMembers();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const typeColors: Record<string, string> = {
    FACULTY: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    STUDENT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    ATHLETE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    CAPTAIN: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    ALUMNI: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Members Management</h1>
          <p className="text-muted-foreground">Manage research team members</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Member</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Member" : "Add New Member"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Role / Designation</Label>
                  <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g., Lead Researcher" />
                </div>
                <div className="space-y-2">
                  <Label>Member Type</Label>
                  <Select value={form.memberType} onValueChange={(v: MemberType) => setForm({ ...form, memberType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(memberTypeLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  className="relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  {form.profilePhoto ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <Image src={form.profilePhoto} alt="Preview" fill className="object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, profilePhoto: "" }))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Upload className={`w-7 h-7 text-muted-foreground ${uploading ? "animate-bounce" : ""}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {uploading ? "Uploading..." : "Drop image here or click to browse"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expertise / Research Interests (comma separated)</Label>
                <Input value={form.expertise} onChange={e => setForm({ ...form, expertise: e.target.value })} placeholder="Cybersecurity, Cryptography, ML" />
              </div>
              <div className="space-y-2">
                <Label>Achievements / Publications (comma separated)</Label>
                <Input value={form.achievements} onChange={e => setForm({ ...form, achievements: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Biography / Highlights</Label>
                <Textarea rows={4} value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, expertise..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : members.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No members found</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {members.map(m => (
            <Card key={m.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted shrink-0">
                  {m.profilePhoto ? (
                    <Image src={m.profilePhoto} alt={m.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-lg font-bold text-muted-foreground">{m.name[0]}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{m.role || "—"}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <Badge variant="secondary" className={typeColors[m.memberType]}>{memberTypeLabels[m.memberType]}</Badge>
                    {m.expertise.slice(0, 3).map((e, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => openEdit(m)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}