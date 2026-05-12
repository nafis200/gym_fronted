"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { aboutService } from "@/services/aboutService";
import { Experience } from "@/types/about";

interface ExperienceManagerProps {
  experience: Experience[];
  onRefresh: () => void;
}

export default function ExperienceManager({ experience, onRefresh }: ExperienceManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    institutionName: "",
    role: "",
    duration: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        await aboutService.updateExperience(editingItem.id, formData);
        toast.success("Experience updated successfully");
      } else {
        await aboutService.createExperience(formData);
        toast.success("Experience created successfully");
      }
      setIsOpen(false);
      setEditingItem(null);
      setFormData({ institutionName: "", role: "", duration: "", description: "" });
      onRefresh();
    } catch (error) {
      toast.error("Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        await aboutService.deleteExperience(id);
        toast.success("Experience deleted successfully");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete experience");
      }
    }
  };

  const handleEdit = (item: Experience) => {
    setEditingItem(item);
    setFormData({
      institutionName: item.institutionName,
      role: item.role,
      duration: item.duration,
      description: item.description || "",
    });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Experience Management</CardTitle>
            <CardDescription>Add, edit, or remove work experience</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingItem(null);
              setFormData({ institutionName: "", role: "", duration: "", description: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Experience" : "Add New Experience"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Institution / Company</Label>
                  <Input
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    placeholder="School or Organization name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role / Position</Label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Your role"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2020 - Present or 3 years"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your responsibilities"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {experience.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No experience added yet</p>
        ) : (
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{exp.role}</h4>
                    <p className="text-sm text-muted-foreground">{exp.institutionName}</p>
                    <span className="text-xs text-primary">{exp.duration}</span>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{exp.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(exp)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(exp.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}