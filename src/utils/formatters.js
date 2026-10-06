/**
 * Format ISO or SQL dates into human-friendly strings (e.g., 06 Oct 2026)
 */
export function formatDate(dateString) {
  if (!dateString) return "Recently";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
}

/**
 * Format salary numbers into Lakhs (e.g. ₹5.50 LPA)
 */
export function formatSalary(salaryText, min, max) {
  if (salaryText && salaryText.trim()) return salaryText;
  if (min && max && min === max) {
    return `₹${(min / 100000).toFixed(2)} LPA`;
  }
  if (min && max) {
    return `₹${(min / 100000).toFixed(2)} – ₹${(max / 100000).toFixed(2)} LPA`;
  }
  if (min) return `From ₹${(min / 100000).toFixed(2)} LPA`;
  return "Competitive Package";
}

/**
 * Truncate text cleanly
 */
export function truncate(text, length = 120) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}
