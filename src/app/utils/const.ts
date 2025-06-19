// Files/folders to ignore by default
export const IGNORE_PATTERNS = [
  ".git/",
  "node_modules/",
  ".DS_Store",
  ".next/",
  "dist/",
  "out/",
  "*.log",
  "npm-debug.log",
  "yarn-error.log",
  "pnpm-lock.yaml",
  "package-lock.json",
  "*.tmp",
  "*.swp",
];

// Files to always read (even if in ignore patterns)
export const ALWAYS_READ_FILES = [".gitignore", "README.md"];
