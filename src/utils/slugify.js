/**
 * Convert string to URL-safe unique slug
 */
export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Collapse dashes
    .replace(/^-+/, "") // Trim dash from start
    .replace(/-+$/, ""); // Trim dash from end
}
