"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
  ContactInfo,
  ContactType,
} from "@/services/contactService";

const TYPE_LABELS: Record<ContactType, string> = {
  phone: "Phone",
  email: "Email",
  address: "Address",
  hours: "Opening Hours",
};

const TYPE_COLORS: Record<ContactType, string> = {
  phone: "bg-blue-100 text-blue-700",
  email: "bg-green-100 text-green-700",
  address: "bg-purple-100 text-purple-700",
  hours: "bg-orange-100 text-orange-700",
};

const EMPTY_FORM = { type: "phone" as ContactType, label: "", value: "", order: 0 };

export default function ContactManagementPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getContactInfo();
      setContacts(res.data);
    } catch {
      toast.error("Failed to load contact info");
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item?: ContactInfo) => {
    if (item) {
      setEditing(item);
      setForm({ type: item.type, label: item.label || "", value: item.value, order: item.order });
    } else {
      setEditing(null);
      setForm(EMPTY_FORM);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.value.trim()) {
      toast.error("Value is required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        type: form.type,
        label: form.label.trim() || undefined,
        value: form.value,
        order: form.order,
      };
      if (editing) {
        await updateContactInfo(editing.id, payload);
        toast.success("Contact info updated successfully");
      } else {
        await createContactInfo(payload);
        toast.success("Contact info created successfully");
      }
      setDialogOpen(false);
      fetchData();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        `Failed to ${editing ? "update" : "create"} contact info`;
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact info?")) return;
    try {
      await deleteContactInfo(id);
      toast.success("Contact info deleted successfully");
      fetchData();
    } catch {
      toast.error("Failed to delete contact info");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Management</h1>
          <p className="text-muted-foreground">Manage the contact details shown on the Contact page</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="h-4 w-4" /> Add Contact Info
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Contact Info" : "Add New Contact Info"}</DialogTitle>
              <DialogDescription>
                Add or update contact details shown on the Contact page
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as ContactType })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TYPE_LABELS) as ContactType[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Label (optional)</Label>
                <Input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g., Main office, Support, Reception"
                />
              </div>
              <div>
                <Label>Value</Label>
                <Textarea
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="e.g., +1 (234) 567-890 or 123 Luxury Avenue,&#10;Grand City, GC 10001"
                  rows={3}
                />
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Add, edit, or remove contact information entries</CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No contact info added yet</p>
          ) : (
            <div className="space-y-4">
              {contacts.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <Badge className={TYPE_COLORS[item.type]}>{TYPE_LABELS[item.type]}</Badge>
                    <div>
                      {item.label && <p className="font-medium text-sm">{item.label}</p>}
                      <p className="whitespace-pre-line">{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">Order: {item.order}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openDialog(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}