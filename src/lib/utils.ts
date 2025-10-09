import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function withBasePath(path: string): string {
  const rawBase = import.meta.env.BASE_URL || "/";
  const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
  if (!path) return base;
  // Normalize to avoid double base and to strip leading slashes or hardcoded "/CV/"
  const cleaned = path
    .replace(/^\/?CV\//, "")
    .replace(/^\/+/, "");
  return `${base}${cleaned}`;
}