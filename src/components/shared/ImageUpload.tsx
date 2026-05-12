"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onDelete?: () => void;
}

export function ImageUpload({ value, onChange, onDelete }: ImageUploadProps) {
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleRemove = () => {
    setPreview("");
    onChange("");
    onDelete?.();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-dashed border-muted flex items-center justify-center bg-muted/20">
        {preview ? (
          <Image src={preview} alt="Preview" fill className="object-cover" />
        ) : (
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="relative">
          <Upload className="w-4 h-4 mr-2" />
          Upload
          <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
        </Button>
        {preview && (
          <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
            <X className="w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
}