"use client";
import React, { useState } from "react";
import { buildTree, collectFiles, getAllChildPaths } from "@/app/utils/tree";
import { createTarGzArchive } from "@/app/actions/compression";
import UploadSection from "@/app/components/UploadSection";
import FileTreeSection from "@/app/components/FileTreeSection";
import DownloadButton from "@/app/components/DownloadButton";

// Extend HTMLInputElement to include webkitdirectory
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

export default function FolderCompressor() {
  const [tree, setTree] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<any>({});

  // Handle folder upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const t = buildTree(fileList, []);
    setTree(t);

    // Set all checked by default - including intermediate folder paths
    const allChecked: any = {};

    // First, mark all files as checked
    Array.from(fileList).forEach((file) => {
      allChecked[file.webkitRelativePath] = true;
    });

    // Then, mark all intermediate folder paths as checked
    Array.from(fileList).forEach((file) => {
      const parts = file.webkitRelativePath.split("/");
      let currentPath = "";

      // Mark each folder in the path as checked
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath += (i > 0 ? "/" : "") + parts[i];
        allChecked[currentPath] = true;
      }
    });

    setChecked(allChecked);
  };

  // Toggle file/folder selection with child path handling
  const handleToggle = (path: string) => {
    setChecked((prev: any) => {
      const newChecked = { ...prev };
      const isChecked = !prev[path];
      newChecked[path] = isChecked;

      if (tree) {
        const childPaths = getAllChildPaths(tree, path);
        childPaths.forEach((childPath) => {
          newChecked[childPath] = isChecked;
        });
      }

      return newChecked;
    });
  };

  // Create TAR.GZ archive
  const handleArchive = async () => {
    if (!tree) return;
    setLoading(true);

    try {
      const files: { [key: string]: Uint8Array } = {};
      const selectedFiles = collectFiles(tree, checked);

      // Add each selected file to the files object
      for (const file of selectedFiles) {
        const content = await file.arrayBuffer();
        files[file.webkitRelativePath] = new Uint8Array(content);
      }

      const compressedData = await createTarGzArchive(files);

      const blob = new Blob([compressedData], { type: "application/gzip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "archive.tar.gz";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating archive:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Directory Compressor
      </h1>

      <UploadSection onUpload={handleUpload} />
      <FileTreeSection tree={tree} checked={checked} onToggle={handleToggle} />
      <DownloadButton
        onClick={handleArchive}
        disabled={!tree || loading}
        loading={loading}
      />

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          How to use:
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Click "Select Directory" to choose a folder</li>
          <li>Review and select/deselect files in the tree view</li>
          <li>
            Click "Download Archive" to create and download the TAR.GZ archive
            (.tar.gz)
          </li>
        </ol>
      </div>
    </div>
  );
}
