"use client";

import React, { useState } from "react";
import { buildTree, collectFiles, getAllChildPaths } from "@/app/utils/tree";
import { createTarGzArchive } from "@/app/actions/compression";
import UploadSection from "./UploadSection";
import FileTreeSection from "./FileTreeSection";
import DownloadButton from "./DownloadButton";

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

    const allChecked: any = {};

    Array.from(fileList).forEach((file) => {
      allChecked[file.webkitRelativePath] = true;
    });

    Array.from(fileList).forEach((file) => {
      const parts = file.webkitRelativePath.split("/");
      let currentPath = "";

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
    <>
      <UploadSection onUpload={handleUpload} />
      <FileTreeSection tree={tree} checked={checked} onToggle={handleToggle} />
      <DownloadButton
        onClick={handleArchive}
        disabled={!tree || loading}
        loading={loading}
      />
    </>
  );
}
