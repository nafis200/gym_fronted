"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { aboutService } from "@/services/aboutService";
import { Statistic } from "@/types/about";

interface StatisticsManagerProps {
  statistics: Statistic[];
  onRefresh: () => void;
}

export default function StatisticsManager({ statistics, onRefresh }: StatisticsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Statistic | null>(null);
  const [formData, setFormData] = useState({ title: "", count: 0, suffix: "+" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        await aboutService.updateStatistic(editingItem.id, formData);
        toast.success("Statistic updated successfully");
      } else {
        await aboutService.createStatistic(formData);
        toast.success("Statistic created successfully");
      }
      setIsOpen(false);
      setEditingItem(null);
      setFormData({ title: "", count: 0, suffix: "+" });
      onRefresh();
    } catch (error) {
      toast.error("Failed to save statistic");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this statistic?")) {
      try {
        await aboutService.deleteStatistic(id);
        toast.success("Statistic deleted successfully");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete statistic");
      }
    }
  };

  const handleEdit = (item: Statistic) => {
    setEditingItem(item);
    setFormData({ title: item.title, count: item.count, suffix: item.suffix });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Statistics Management</CardTitle>
            <CardDescription>Add, edit, or remove statistics numbers</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingItem(null);
              setFormData({ title: "", count: 0, suffix: "+" });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Statistic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Statistic" : "Add New Statistic"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Students Trained"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Count</Label>
                    <Input
                      type="number"
                      value={formData.count}
                      onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Suffix</Label>
                    <Input
                      value={formData.suffix}
                      onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                      placeholder="e.g., +"
                    />
                  </div>
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
        {statistics.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No statistics added yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statistics.map((stat) => (
              <div key={stat.id} className="p-4 border rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">
                  {stat.count}{stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.title}</div>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(stat)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(stat.id)}>
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