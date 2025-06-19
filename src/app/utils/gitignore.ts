import { IGNORE_PATTERNS, ALWAYS_READ_FILES } from "./const";

// Follows https://git-scm.com/docs/gitignore

// Helper to parse .gitignore patterns
export function parseGitignore(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      return line.replace(/(?<!\\)\s+$/, "");
    });
}

function escapeRegExp(string: string): string {
  return string.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

function patternToRegex(pattern: string): RegExp {
  const isNegation = pattern.startsWith("!");
  if (isNegation) {
    pattern = pattern.slice(1);
  }

  const hasLeadingSlash = pattern.startsWith("/");
  const hasMiddleSlash = pattern.includes("/") && !hasLeadingSlash;
  const hasTrailingSlash = pattern.endsWith("/");

  if (hasLeadingSlash) {
    pattern = pattern.slice(1);
  }

  if (hasTrailingSlash) {
    pattern = pattern.slice(0, -1);
  }

  let regexPattern = pattern;

  if (regexPattern.startsWith("**/")) {
    regexPattern = regexPattern.slice(3);
    const escapedPattern = escapeRegExp(regexPattern)
      .replace(/\\\*/g, "[^/]*")
      .replace(/\\\?/g, "[^/]");

    if (hasLeadingSlash || hasMiddleSlash) {
      return new RegExp(`^${escapedPattern}(/|$)`);
    } else {
      return new RegExp(`(^|/)${escapedPattern}(/|$)`);
    }
  }

  // Handle trailing /** (e.g., "abc/**")
  if (regexPattern.endsWith("/**")) {
    regexPattern = regexPattern.slice(0, -3);
    const escapedPattern = escapeRegExp(regexPattern)
      .replace(/\\\*/g, "[^/]*")
      .replace(/\\\?/g, "[^/]");

    if (hasLeadingSlash || hasMiddleSlash) {
      return new RegExp(`^${escapedPattern}(/.*)?$`);
    } else {
      return new RegExp(`(^|/)${escapedPattern}(/.*)?$`);
    }
  }

  // Handle middle /** (e.g., "a/**/b")
  if (regexPattern.includes("/**/")) {
    regexPattern = regexPattern.replace(/\/\*\*\//g, "(/[^/]*/)*");
    const escapedPattern = escapeRegExp(regexPattern)
      .replace(/\\\*/g, "[^/]*")
      .replace(/\\\?/g, "[^/]")
      .replace(/\(\/\[\\^\/\]\*\/\)\*/g, "(/[^/]*/)*");

    if (hasLeadingSlash || hasMiddleSlash) {
      return new RegExp(`^${escapedPattern}$`);
    } else {
      return new RegExp(`(^|/)${escapedPattern}$`);
    }
  }

  // Regular pattern processing
  const escapedPattern = escapeRegExp(regexPattern)
    .replace(/\\\*/g, "[^/]*")
    .replace(/\\\?/g, "[^/]");

  if (hasLeadingSlash || hasMiddleSlash) {
    if (hasTrailingSlash) {
      return new RegExp(`^${escapedPattern}(/|$)`);
    } else {
      return new RegExp(`^${escapedPattern}$`);
    }
  } else {
    if (hasTrailingSlash) {
      return new RegExp(`(^|/)${escapedPattern}(/|$)`);
    } else {
      return new RegExp(`(^|/)${escapedPattern}(/|$)`);
    }
  }
}

function matchesGitignorePattern(filePath: string, pattern: string): boolean {
  const normalizedPath = filePath.startsWith("/")
    ? filePath.slice(1)
    : filePath;

  const isNegation = pattern.startsWith("!");
  const actualPattern = isNegation ? pattern.slice(1) : pattern;

  const regex = patternToRegex(actualPattern);
  const matches = regex.test(normalizedPath);

  return isNegation ? !matches : matches;
}

// Helper to check if a file matches any .gitignore pattern
export function isIgnored(filePath: string, patterns: string[] = []): boolean {
  if (ALWAYS_READ_FILES.some((f) => filePath.endsWith(f))) return false;

  const allPatterns = [...IGNORE_PATTERNS, ...patterns];

  let isIgnoredResult = false;

  for (const pattern of allPatterns) {
    if (pattern.startsWith("!")) {
      if (matchesGitignorePattern(filePath, pattern.slice(1))) {
        isIgnoredResult = false;
      }
    } else {
      if (matchesGitignorePattern(filePath, pattern)) {
        isIgnoredResult = true;
      }
    }
  }

  return isIgnoredResult;
}
