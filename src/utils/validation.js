/**
 * Form and input validation helpers
 */

export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function isValidUrl(url) {
  if (!url) return true; // Optional URLs pass
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(str) {
  if (!str || typeof str !== "string") return "";
  return str.trim();
}
