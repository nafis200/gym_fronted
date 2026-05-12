"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Star, Quote } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { aboutService } from "@/services/aboutService";
import { Testimonial } from "@/types/about";

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

export default function TestimonialsManager({ testimonials, onRefresh }: TestimonialsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    studentName: "",
    message: "",
    designation: "",
    rating: 5,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        await aboutService.updateTestimonial(editingItem.id, formData);
        toast.success("Testimonial updated successfully");
      } else {
        await aboutService.createTestimonial(formData);
        toast.success("Testimonial created successfully");
      }
      setIsOpen(false);
      setEditingItem(null);
      setFormData({ studentName: "", message: "", designation: "", rating: 5, image: "" });
      setImagePreview("");
      onRefresh();
    } catch (error) {
      toast.error("Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await aboutService.deleteTestimonial(id);
        toast.success("Testimonial deleted successfully");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete testimonial");
      }
    }
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      studentName: item.studentName,
      message: item.message,
      designation: item.designation || "",
      rating: item.rating,
      image: item.image || "",
    });
    setImagePreview(item.image || "");
    setIsOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Testimonials Management</CardTitle>
            <CardDescription>Add, edit, or remove student testimonials</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingItem(null);
              setFormData({ studentName: "", message: "", designation: "", rating: 5, image: "" });
              setImagePreview("");
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Student Name</Label>
                  <Input
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Name of the student"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g., Former Student, Professional Athlete"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Testimonial message"
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formData.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-auto"
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
        {testimonials.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No testimonials added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.studentName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-primary font-semibold">
                        {testimonial.studentName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{testimonial.studentName}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                    {testimonial.designation && (
                      <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      <Quote className="w-4 h-4 inline mr-1" />
                      {testimonial.message}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(testimonial.id)}>
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