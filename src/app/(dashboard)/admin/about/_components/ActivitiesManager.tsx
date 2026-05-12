"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { aboutService } from "@/services/aboutService";
import { DailyActivity } from "@/types/about";

interface ActivitiesManagerProps {
  activities: DailyActivity[];
  onRefresh: () => void;
}

export default function ActivitiesManager({ activities, onRefresh }: ActivitiesManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DailyActivity | null>(null);
  const [formData, setFormData] = useState({ title: "", time: "", description: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        await aboutService.updateActivity(editingItem.id, formData);
        toast.success("Activity updated successfully");
      } else {
        await aboutService.createActivity(formData);
        toast.success("Activity created successfully");
      }
      setIsOpen(false);
      setEditingItem(null);
      setFormData({ title: "", time: "", description: "" });
      onRefresh();
    } catch (error) {
      toast.error("Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await aboutService.deleteActivity(id);
        toast.success("Activity deleted successfully");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete activity");
      }
    }
  };

  const handleEdit = (item: DailyActivity) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      time: item.time,
      description: item.description || "",
    });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily Activities Management</CardTitle>
            <CardDescription>Add, edit, or remove daily schedule items</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingItem(null);
              setFormData({ title: "", time: "", description: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Activity" : "Add New Activity"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Morning Training"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 6:00 AM - 8:00 AM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the activity"
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
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No activities added yet</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 h-16 bg-muted mt-2" />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <span className="text-sm text-primary">{activity.time}</span>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(activity)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(activity.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}