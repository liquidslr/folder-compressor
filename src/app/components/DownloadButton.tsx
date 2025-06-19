"use client";
import React from "react";

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function DownloadButton({
  onClick,
  disabled,
  loading,
}: DownloadButtonProps) {
  return (
    <button
      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-lg mb-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {loading ? "Creating Archive..." : "Download Compressed Archive"}
    </button>
  );
}
