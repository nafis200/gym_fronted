"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { aboutService } from "@/services/aboutService";
import { GalleryImage } from "@/types/about";

interface GalleryManagerProps {
  gallery: GalleryImage[];
  onRefresh: () => void;
}

export default function GalleryManager({ gallery, onRefresh }: GalleryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({ imageUrl: "", caption: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        await aboutService.updateGalleryImage(editingItem.id, formData);
        toast.success("Image updated successfully");
      } else {
        await aboutService.createGalleryImage(formData);
        toast.success("Image added successfully");
      }
      setIsOpen(false);
      setEditingItem(null);
      setFormData({ imageUrl: "", caption: "" });
      onRefresh();
    } catch (error) {
      toast.error("Failed to save image");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await aboutService.deleteGalleryImage(id);
        toast.success("Image deleted successfully");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
  };

  const handleEdit = (item: GalleryImage) => {
    setEditingItem(item);
    setFormData({ imageUrl: item.imageUrl, caption: item.caption || "" });
    setIsOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gallery Management</CardTitle>
            <CardDescription>Add, edit, or remove gallery images</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingItem(null);
              setFormData({ imageUrl: "", caption: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Image" : "Add New Image"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-dashed">
                      {formData.imageUrl ? (
                        <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Or paste image URL"
                        value={formData.imageUrl.startsWith("data:") ? "" : formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Input
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Image caption (optional)"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving || !formData.imageUrl}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {gallery.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No images added yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((image) => (
              <div key={image.id} className="relative group">
                <div className="relative h-40 rounded-lg overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.caption || "Gallery image"}
                    fill
                    className="object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                      {image.caption}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(image)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(image.id)}
                    >
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