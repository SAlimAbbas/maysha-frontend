"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Star, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

interface CloudinaryGalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  maxImages?: number;
  label?: string;
}

export default function CloudinaryGalleryUploader({
  images,
  onChange,
  folder = "maysha/products",
  maxImages = 8,
  label = "Product Images (Cloudinary Hosted)",
}: CloudinaryGalleryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      setErrorMessage("Please select valid image files (PNG, JPG, WebP).");
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      setErrorMessage(`Maximum limit is ${maxImages} images per product.`);
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgressText(`Uploading ${i + 1} of ${validFiles.length}...`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/bff/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || `Failed to upload image ${file.name}`);
        }

        uploadedUrls.push(json.url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to complete upload.");
    } finally {
      setIsUploading(false);
      setUploadProgressText(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const filtered = images.filter((_, i) => i !== index);
    onChange([target, ...filtered]);
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-[#1A1A1A] block">
          {label} ({images.length}/{maxImages})
        </label>
        <span className="text-[11px] font-medium text-[#4E5942] bg-[#EDF3E8] px-2 py-0.5 rounded-full">
          Cloudinary CDN (fopric4g)
        </span>
      </div>

      {/* Gallery Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative aspect-square rounded-2xs overflow-hidden border border-[#E8E3DA] bg-[#EFECE4] group"
            >
              <Image
                src={url}
                alt={`Product image ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover"
              />

              {/* Primary Badge */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-[#4E5942] text-white text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-2xs shadow-xs flex items-center gap-1 z-10">
                  <Star className="w-2.5 h-2.5 fill-current" /> Primary
                </span>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-10">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleMakePrimary(idx)}
                    className="w-full bg-white text-[#1A1A1A] text-[11px] font-semibold py-1 rounded-2xs hover:bg-[#FBF9F5]"
                  >
                    Set as Primary
                  </button>
                )}

                <div className="flex items-center gap-1 w-full justify-center">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "left")}
                      title="Move left"
                      className="bg-white/90 hover:bg-white text-[#1A1A1A] p-1 rounded-2xs text-[11px]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "right")}
                      title="Move right"
                      className="bg-white/90 hover:bg-white text-[#1A1A1A] p-1 rounded-2xs text-[11px]"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    title="Remove image"
                    className="bg-[#A94438] hover:bg-[#8B342B] text-white p-1 rounded-2xs text-[11px]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xs p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-[#4E5942] bg-[#EDF3E8]/30"
              : "border-[#D0C9BE] bg-[#FBF9F5] hover:border-[#1A1A1A] hover:bg-white"
          }`}
        >
          {isUploading ? (
            <div className="space-y-2 py-3">
              <Loader2 className="w-7 h-7 text-[#4E5942] animate-spin mx-auto" />
              <p className="text-[13px] font-semibold text-[#1A1A1A]">
                {uploadProgressText || "Uploading to Cloudinary..."}
              </p>
              <p className="text-[11px] text-[#736E67]">
                Optimizing dimensions and high-speed global delivery
              </p>
            </div>
          ) : (
            <div className="space-y-2 py-1">
              <div className="w-10 h-10 rounded-full bg-[#EFECE4] text-[#4E5942] flex items-center justify-center mx-auto">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-[13px] font-semibold text-[#1A1A1A]">
                Drag and Drop photos here or <span className="text-[#4E5942] underline">Browse</span>
              </p>
              <span className="text-[11px] text-[#8C867D] block">
                PNG, JPG, WEBP up to 10MB • Multiple uploads supported
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleUploadFiles(e.target.files);
          }
        }}
        className="hidden"
      />

      {errorMessage && (
        <p className="text-[12px] text-[#A94438]">{errorMessage}</p>
      )}
    </div>
  );
}
