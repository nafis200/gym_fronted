"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Trophy } from "lucide-react";
import { toast } from "sonner";
import { aboutService } from "@/services/aboutService";
import { AboutAchievement } from "@/types/about";

interface AchievementsManagerProps {
  achievements: AboutAchievement[];
  onRefresh: () => void;
}

export default function AchievementsManager({ achievements, onRefresh }: AchievementsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AboutAchievement | null>(null);
  const [formData, setFormData] = useState({ title: "", organization: "", year: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : undefined,
      };
      if (editingItem) {
        await aboutService.updateAchievement(editingItem.id, data);
        toast.success("Achievement updated successfully");
      } else {
        await aboutService.createAchievement(data);
        toast.success("Achievement created successfully");
      }
      setIsOpen(false);
      setEditingItem(null);
      setFormData({ title: "", organization: "", year: "" });
      onRefresh();
    } catch (error) {
      toast.error("Failed to save achievement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      try {
        await aboutService.deleteAchievement(id);
        toast.success("Achievement deleted successfully");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete achievement");
      }
    }
  };

  const handleEdit = (item: AboutAchievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      organization: item.organization || "",
      year: item.year?.toString() || "",
    });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Achievements Management</CardTitle>
            <CardDescription>Add, edit, or remove achievements</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingItem(null);
              setFormData({ title: "", organization: "", year: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Achievement" : "Add New Achievement"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., National Coach Award"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Awarding organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g., 2024"
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
        {achievements.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No achievements added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      {achievement.organization && (
                        <p className="text-sm text-muted-foreground">{achievement.organization}</p>
                      )}
                      {achievement.year && (
                        <span className="text-xs text-primary">{achievement.year}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(achievement)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(achievement.id)}>
                    <Trash2 className="w-3 h-3 text-red-500" />
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