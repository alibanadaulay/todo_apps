"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface TodoImageUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function TodoImageUpload({ value, onChange }: TodoImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      
      // Upload to backend server
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }
      
      const data = await response.json();
      
      // Update preview and form value with the URL
      const imageUrl = `${API_URL}/${data.path}`;
      setPreview(imageUrl);
      onChange(imageUrl);
      
      toast.success(data.message || "Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    onChange(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="relative"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload Image
            </>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </Button>
        {preview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {preview && (
        <div className="relative w-full h-48">
          <Image
            src={preview}
            alt="Todo image"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
} 