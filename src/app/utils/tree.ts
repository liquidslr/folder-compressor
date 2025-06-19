import { isIgnored } from "./gitignore";

// Recursively build a tree from FileList
export function buildTree(files: FileList, gitignorePatterns: string[] = []) {
  const tree: any = {};
  Array.from(files).forEach((file) => {
    const parts = file.webkitRelativePath.split("/");
    let current = tree;
    let path = "";

    for (let i = 0; i < parts.length; i++) {
      path += (i > 0 ? "/" : "") + parts[i];

      if (
        isIgnored(path, gitignorePatterns) ||
        isIgnored(parts[i], gitignorePatterns)
      ) {
        return;
      }
    }

    current = tree;
    path = "";
    for (let i = 0; i < parts.length; i++) {
      path += (i > 0 ? "/" : "") + parts[i];
      if (!current[parts[i]]) {
        current[parts[i]] = i === parts.length - 1 ? file : {};
      }
      current = current[parts[i]];
    }
  });
  return tree;
}

// Recursively collect selected files
export function collectFiles(tree: any, checked: any, path = ""): File[] {
  let out: File[] = [];
  for (const [name, value] of Object.entries(tree)) {
    const fullPath = path ? `${path}/${name}` : name;
    if (!checked[fullPath]) continue;
    if (value instanceof File) {
      const originalFile = value as File;
      out.push(originalFile);
    } else {
      out = out.concat(collectFiles(value, checked, fullPath));
    }
  }
  return out;
}

// Get all child paths for a given path in the tree
export function getAllChildPaths(tree: any, parentPath: string): string[] {
  const paths: string[] = [];
  const parentParts = parentPath.split("/");
  let current = tree;

  for (const part of parentParts) {
    if (!current[part]) return paths;
    current = current[part];
  }

  function collectPaths(node: any, currentPath: string) {
    if (node instanceof File) {
      paths.push(currentPath);
      return;
    }

    for (const [name, value] of Object.entries(node)) {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;
      paths.push(fullPath);
      if (!(value instanceof File)) {
        collectPaths(value, fullPath);
      }
    }
  }

  collectPaths(current, parentPath);
  return paths;
}
