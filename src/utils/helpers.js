import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format salary string or numbers
 */
export function formatSalary(salary) {
  if (!salary) return "Competitive";
  return salary;
}

/**
 * Format ISO dates into human readable format (e.g. 06 Sep 2026)
 */
export function formatDate(dateString) {
  if (!dateString) return "Recently Posted";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
}

/**
 * Turn string into URL-friendly slug
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}
