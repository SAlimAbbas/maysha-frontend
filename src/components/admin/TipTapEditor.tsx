"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Unlink,
  Undo2,
  Redo2,
  RemoveFormatting,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function normalizeContentToHtml(content: string): string {
  if (!content) return "";
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }
  // Convert plain text markdown / newlines to clean HTML
  return content
    .split(/\n\n+/)
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) {
        return `<h2>${trimmed.replace(/^##\s*/, "")}</h2>`;
      }
      if (trimmed.startsWith("### ")) {
        return `<h3>${trimmed.replace(/^###\s*/, "")}</h3>`;
      }
      if (trimmed.startsWith("> ")) {
        return `<blockquote>${trimmed.replace(/^>\s*/, "")}</blockquote>`;
      }
      if (trimmed === "---") {
        return `<hr />`;
      }
      const withFormatting = trimmed
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      return `<p>${withFormatting.replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("");
}

export default function TipTapEditor({
  value,
  onChange,
  placeholder = "Write your editorial story with scientific depth, ritual guidance, formatting...",
  minHeight = "240px",
}: TipTapEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-[#4E5942] underline font-medium hover:text-[#1A1A1A] cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: normalizeContentToHtml(value || ""),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-stone max-w-none p-4 min-h-[${minHeight}] max-h-[460px] overflow-y-auto focus:outline-none text-[14px] leading-relaxed text-[#1A1A1A] tiptap-editor-body`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value updates
  useEffect(() => {
    if (!editor) return;
    const normalized = normalizeContentToHtml(value || "");
    const current = editor.getHTML();
    if (normalized !== current && !editor.isFocused) {
      editor.commands.setContent(normalized);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="border border-[#E8E3DA] rounded-xs p-6 bg-[#FFFFFF] min-h-[220px] flex items-center justify-center text-[#736E67] text-[13px]">
        Loading text editor...
      </div>
    );
  }

  const handleOpenLinkInput = () => {
    const currentHref = editor.getAttributes("link").href || "";
    setLinkUrl(currentHref);
    setShowLinkInput((prev) => !prev);
  };

  const handleApplyLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = linkUrl.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkInput(false);
      return;
    }
    const finalUrl = /^(https?:\/\/|mailto:|\/|#)/i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const isLinkActive = editor.isActive("link");

  return (
    <div className="border border-[#E8E3DA] rounded-xs overflow-hidden bg-white shadow-2xs">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F6F3EC] border-b border-[#E8E3DA] select-none">
        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 text-[12px] bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] disabled:opacity-40 rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 text-[12px] bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] disabled:opacity-40 rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-[#E0DBCF] mx-1" />

        {/* Text Formats */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2.5 py-1 text-[12px] font-bold border rounded-2xs flex items-center gap-1 cursor-pointer transition-colors ${
            editor.isActive("bold")
              ? "bg-[#4E5942] text-white border-[#4E5942]"
              : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3 h-3" /> Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2.5 py-1 text-[12px] italic border rounded-2xs flex items-center gap-1 cursor-pointer transition-colors ${
            editor.isActive("italic")
              ? "bg-[#4E5942] text-white border-[#4E5942]"
              : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3 h-3" /> Italic
        </button>

        <span className="w-px h-5 bg-[#E0DBCF] mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2.5 py-1 text-[12px] font-semibold border rounded-2xs flex items-center gap-1 cursor-pointer transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-[#4E5942] text-white border-[#4E5942]"
              : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
          }`}
          title="Section Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" /> H2 Title
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2.5 py-1 text-[12px] font-semibold border rounded-2xs flex items-center gap-1 cursor-pointer transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-[#4E5942] text-white border-[#4E5942]"
              : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
          }`}
          title="Subheading 3"
        >
          <Heading3 className="w-3.5 h-3.5" /> H3 Subtitle
        </button>

        <span className="w-px h-5 bg-[#E0DBCF] mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2.5 py-1 text-[12px] font-semibold border rounded-2xs flex items-center gap-1 cursor-pointer transition-colors ${
            editor.isActive("bulletList")
              ? "bg-[#4E5942] text-white border-[#4E5942]"
              : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
          }`}
          title="Bullet List"
        >
          <List className="w-3 h-3" /> Bullet List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2.5 py-1 text-[12px] font-semibold border rounded-2xs flex items-center gap-1 cursor-pointer transition-colors ${
            editor.isActive("orderedList")
              ? "bg-[#4E5942] text-white border-[#4E5942]"
              : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3 h-3" /> Steps
        </button>

        {/* Quote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2.5 py-1 text-[12px] font-semibold border rounded-2xs flex items-center gap-1 cursor-pointer transition-colors ${
            editor.isActive("blockquote")
              ? "bg-[#4E5942] text-white border-[#4E5942]"
              : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
          }`}
          title="Editorial Blockquote"
        >
          <Quote className="w-3 h-3" /> Quote
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E8E3DA] hover:border-[#1A1A1A] rounded-2xs flex items-center gap-1 text-[#1A1A1A] cursor-pointer"
          title="Section Divider Line"
        >
          <Minus className="w-3 h-3" /> Divider
        </button>

        <span className="w-px h-5 bg-[#E0DBCF] mx-1" />

        {/* Hyperlink Controls */}
        <button
          type="button"
          onClick={handleOpenLinkInput}
          className={`px-2.5 py-1 text-[12px] font-semibold border rounded-2xs flex items-center gap-1 cursor-pointer transition-colors ${
            isLinkActive || showLinkInput
              ? "bg-[#4E5942] text-white border-[#4E5942]"
              : "bg-white text-[#1A1A1A] border-[#E8E3DA] hover:border-[#1A1A1A]"
          }`}
          title="Add / Edit Hyperlink"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Link</span>
        </button>

        {isLinkActive && (
          <button
            type="button"
            onClick={handleRemoveLink}
            className="px-2 py-1 text-[12px] font-semibold bg-[#FDF2F0] text-[#A94438] border border-[#F5C2BC] hover:border-[#A94438] rounded-2xs flex items-center gap-1 cursor-pointer"
            title="Remove Hyperlink"
          >
            <Unlink className="w-3 h-3" />
            <span>Unlink</span>
          </button>
        )}

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 text-[12px] bg-white border border-[#E8E3DA] hover:border-[#A94438] hover:text-[#A94438] rounded-2xs flex items-center gap-1 text-[#736E67] cursor-pointer ml-auto"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Link Toolbar Popover */}
      {showLinkInput && (
        <form
          onSubmit={handleApplyLink}
          className="flex items-center gap-2 p-2.5 bg-[#F0ECE4] border-b border-[#E8E3DA] text-[13px] animate-fadeIn"
        >
          <ExternalLink className="w-4 h-4 text-[#4E5942] shrink-0" />
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste or type URL (e.g. https://mayshaindia.com/shop or /products/slug)..."
            autoFocus
            className="flex-1 bg-white border border-[#D8D2C6] rounded-2xs px-3 py-1.5 text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#4E5942]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#4E5942] hover:bg-[#3F4835] text-white text-[12px] font-semibold rounded-2xs flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Apply
          </button>
          {isLinkActive && (
            <button
              type="button"
              onClick={handleRemoveLink}
              className="px-2.5 py-1.5 bg-white border border-[#E8E3DA] hover:bg-[#FDF2F0] text-[#A94438] text-[12px] font-semibold rounded-2xs cursor-pointer"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="p-1.5 text-[#736E67] hover:text-[#1A1A1A] cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Editor Content Area */}
      <div className="relative bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
