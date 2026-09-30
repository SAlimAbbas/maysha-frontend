"use client";

import React from "react";
import { useUIStore } from "@/stores/uiStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastProvider() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-[#FFFFFF] border border-[#E8E3DA] shadow-lg rounded-xs transition-all duration-200 transform translate-y-0"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-[#4E5942]" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-[#A94438]" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-[#5A5650]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-[#1A1A1A] leading-tight">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-xs text-[#5A5650] mt-1 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#8C867D] hover:text-[#1A1A1A] transition-colors p-0.5"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
