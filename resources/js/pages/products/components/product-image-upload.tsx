"use client"

import type React from "react"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProductImageUploadProps {
  imagePreview: string | null
  onImageChange: (image: File | null) => void
  label?: string
}

export function ProductImageUpload({ imagePreview, onImageChange, label = "Product Image" }: ProductImageUploadProps) {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
        {imagePreview ? (
          <div className="space-y-4">
            <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Button type="button" variant="outline" onClick={() => onImageChange(null)} className="w-full">
              Remove Image
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-4">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-foreground">Click to upload image</span>
                <span className="mt-1 block text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</span>
              </Label>
              <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
