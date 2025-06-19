import { IGNORE_PATTERNS, ALWAYS_READ_FILES } from "./const";

// Helper to parse .gitignore patterns
export function parseGitignore(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function matchesPattern(filePath: string, pattern: string): boolean {
  if (pattern.endsWith("/")) {
    return filePath.includes(`/${pattern}`) || filePath.startsWith(pattern);
  }
  if (pattern.startsWith("*")) {
    return filePath.endsWith(pattern.slice(1));
  }
  return filePath === pattern;
}

// Helper to check if a file matches any .gitignore pattern
export function isIgnored(filePath: string, patterns: string[] = []): boolean {
  if (ALWAYS_READ_FILES.some((f) => filePath.endsWith(f))) return false;
  const allPatterns = [...IGNORE_PATTERNS, ...patterns];
  return allPatterns.some((pattern) => matchesPattern(filePath, pattern));
}
