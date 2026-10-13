"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
  currentImage?: string;
}

export default function CloudinaryUploader({
  onUploadSuccess,
  folder = "maysha/products",
  label = "Upload Image to Cloudinary",
  currentImage,
}: CloudinaryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/bff/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to upload to Cloudinary");
      }

      setPreviewUrl(json.url);
      onUploadSuccess(json.url);
    } catch (err: any) {
      setErrorMessage(err.message || "Upload failed. Please check network connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-[#1A1A1A] block">
          {label}
        </label>
        <span className="text-[11px] font-medium text-[#4E5942] bg-[#EDF3E8] px-2 py-0.5 rounded-full">
          Cloudinary CDN (fopric4g)
        </span>
      </div>

      {previewUrl ? (
        <div className="relative w-full aspect-video sm:aspect-[16/9] max-h-48 rounded-xs overflow-hidden border border-[#E8E3DA] bg-[#EFECE4] group">
          <Image
            src={previewUrl}
            alt="Uploaded preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {/* Mobile always-accessible controls */}
          <div className="sm:hidden absolute top-2 right-2 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/95 text-[#1A1A1A] px-2.5 py-1 rounded-2xs text-[11px] font-semibold shadow-xs"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                onUploadSuccess("");
              }}
              className="bg-[#A94438] text-white px-2.5 py-1 rounded-2xs text-[11px] font-semibold shadow-xs"
            >
              Remove
            </button>
          </div>

          {/* Desktop hover controls */}
          <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-[#1A1A1A] px-3 py-1.5 rounded-2xs text-[12px] font-semibold hover:bg-[#FBF9F5]"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                onUploadSuccess("");
              }}
              className="bg-[#A94438] text-white px-3 py-1.5 rounded-2xs text-[12px] font-semibold"
            >
              Remove
            </button>
          </div>
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-2xs flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3 text-[#4E5942]" /> Uploaded
          </span>
        </div>
      ) : (
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
            <div className="space-y-2 py-4">
              <Loader2 className="w-8 h-8 text-[#4E5942] animate-spin mx-auto" />
              <p className="text-[13px] font-semibold text-[#1A1A1A]">
                Uploading directly to Cloudinary...
              </p>
              <p className="text-[12px] text-[#736E67]">Optimizing resolution and caching</p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="w-12 h-12 rounded-full bg-[#EFECE4] text-[#4E5942] flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1A1A1A]">
                  Drag and Drop asset here
                </p>
                <p className="text-[12px] text-[#736E67] mt-0.5">
                  or <span className="text-[#4E5942] underline font-medium">Browse from computer</span>
                </p>
              </div>
              <span className="inline-block text-[11px] text-[#8C867D]">
                PNG, JPG, WEBP up to 10MB
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {errorMessage && (
        <p className="text-[12px] text-[#A94438]">{errorMessage}</p>
      )}
    </div>
  );
}
