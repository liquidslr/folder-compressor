"use client";
import React from "react";

interface UploadSectionProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadSection({ onUpload }: UploadSectionProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-8 text-center">
      <div className="mb-6">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <p className="text-lg text-gray-600 mb-6">
          Choose a folder to compress
        </p>
        <label className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full cursor-pointer inline-block">
          Select Directory
          <input
            type="file"
            webkitdirectory="true"
            className="hidden"
            onChange={onUpload}
          />
        </label>
      </div>
    </div>
  );
}
