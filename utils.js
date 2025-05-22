// utils.js — Helper Functions for ShivExa Pro

// Format Date like "22 May 2025"
export function formatDate(date) {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Generate a unique ID (for post/story/message/etc.)
export function generateUID(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

// Capitalize first letter of a string
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Truncate long text (for previews)
export function truncate(text, maxLength = 100) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// Validate email
export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// Show toast message (basic)
export function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
