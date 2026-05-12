"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import { aboutService } from "@/services/aboutService";
import { Skill } from "@/types/about";

interface SkillsManagerProps {
  skills: Skill[];
  onRefresh: () => void;
}

export default function SkillsManager({ skills, onRefresh }: SkillsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ name: "", percentage: 50 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingSkill) {
        await aboutService.updateSkill(editingSkill.id, formData);
        toast.success("Skill updated successfully");
      } else {
        await aboutService.createSkill(formData);
        toast.success("Skill created successfully");
      }
      setIsOpen(false);
      setEditingSkill(null);
      setFormData({ name: "", percentage: 50 });
      onRefresh();
    } catch (error) {
      toast.error("Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        await aboutService.deleteSkill(id);
        toast.success("Skill deleted successfully");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete skill");
      }
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, percentage: skill.percentage });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skills Management</CardTitle>
            <CardDescription>Add, edit, or remove skills</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingSkill(null);
              setFormData({ name: "", percentage: 50 });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Skill Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sports Coaching"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Percentage</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) })}
                    required
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
        {skills.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No skills added yet</p>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(skill)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(skill.id)}>
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