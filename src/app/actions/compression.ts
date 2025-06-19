"use server";

import { gzipSync } from "fflate";
import * as tar from "tar-stream";
import { promises as fs } from "fs";
import path from "path";

export async function createTarGzArchive(files: { [key: string]: Uint8Array }) {
  try {
    const pack = tar.pack();
    const chunks: Buffer[] = [];

    // Collect tar stream chunks
    pack.on("data", (chunk: any) => {
      chunks.push(chunk);
    });

    const tarPromise = new Promise<Buffer>((resolve, reject) => {
      pack.on("end", () => {
        const tarBuffer = Buffer.concat(chunks);
        resolve(tarBuffer);
      });

      pack.on("error", (err) => {
        reject(err);
      });
    });

    // Add each file to the tar archive sequentially
    for (const [name, content] of Object.entries(files)) {
      await new Promise<void>((resolve, reject) => {
        const entry = pack.entry(
          {
            name: name,
            size: content.length,
            mode: 0o644,
            mtime: new Date(),
            type: "file",
          },
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );

        entry.end(content);
      });
    }

    pack.finalize();

    const tarBuffer = await tarPromise;
    const tarUint8Array = new Uint8Array(tarBuffer);
    const gzipped = gzipSync(tarUint8Array);

    return gzipped;
  } catch (error) {
    console.error("Error creating tar.gz archive:", error);
    throw new Error("Failed to create tar.gz archive");
  }
}

export async function createArchiveFromFileSystem(filePaths: string[]) {
  const files: { [key: string]: Uint8Array } = {};

  for (const filePath of filePaths) {
    try {
      const fileBuffer = await fs.readFile(filePath);
      const relativePath = path.basename(filePath);
      files[relativePath] = new Uint8Array(fileBuffer);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  return createTarGzArchive(files);
}

export async function createArchiveFromDirectory(dirPath: string) {
  const files: { [key: string]: Uint8Array } = {};

  async function walkDirectory(currentPath: string, relativePath: string = "") {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const entryRelativePath = relativePath
        ? `${relativePath}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        await walkDirectory(fullPath, entryRelativePath);
      } else if (entry.isFile()) {
        try {
          const fileBuffer = await fs.readFile(fullPath);
          files[entryRelativePath] = new Uint8Array(fileBuffer);
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error);
        }
      }
    }
  }

  await walkDirectory(dirPath);
  return createTarGzArchive(files);
}

export async function createArchiveFromFormData(formData: FormData) {
  const files: { [key: string]: Uint8Array } = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const arrayBuffer = await value.arrayBuffer();
      files[value.name] = new Uint8Array(arrayBuffer);
    }
  }

  return createTarGzArchive(files);
}
