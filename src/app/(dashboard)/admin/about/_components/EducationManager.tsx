"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { aboutService } from "@/services/aboutService";
import { Education } from "@/types/about";

interface EducationManagerProps {
  education: Education[];
  onRefresh: () => void;
}

export default function EducationManager({ education, onRefresh }: EducationManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    passingYear: "",
    specialization: "",
    grade: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        ...formData,
        passingYear: formData.passingYear ? parseInt(formData.passingYear) : undefined,
      };
      if (editingItem) {
        await aboutService.updateEducation(editingItem.id, data);
        toast.success("Education updated successfully");
      } else {
        await aboutService.createEducation(data);
        toast.success("Education created successfully");
      }
      setIsOpen(false);
      setEditingItem(null);
      setFormData({ degree: "", institution: "", passingYear: "", specialization: "", grade: "" });
      onRefresh();
    } catch (error) {
      toast.error("Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this education?")) {
      try {
        await aboutService.deleteEducation(id);
        toast.success("Education deleted successfully");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete education");
      }
    }
  };

  const handleEdit = (item: Education) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      passingYear: item.passingYear?.toString() || "",
      specialization: item.specialization || "",
      grade: item.grade || "",
    });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Education Management</CardTitle>
            <CardDescription>Add, edit, or remove educational qualifications</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingItem(null);
              setFormData({ degree: "", institution: "", passingYear: "", specialization: "", grade: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Education" : "Add New Education"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Degree / Qualification</Label>
                  <Input
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g., Master's in Physical Education"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="University or College name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Passing Year</Label>
                    <Input
                      type="number"
                      value={formData.passingYear}
                      onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                      placeholder="e.g., 2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade / CGPA</Label>
                    <Input
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="e.g., A+ or 3.8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Area of focus"
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
        {education.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No education added yet</p>
        ) : (
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <div className="flex gap-2 mt-1">
                      {edu.passingYear && (
                        <span className="text-xs text-muted-foreground">Year: {edu.passingYear}</span>
                      )}
                      {edu.grade && (
                        <span className="text-xs text-muted-foreground">Grade: {edu.grade}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(edu)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(edu.id)}>
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