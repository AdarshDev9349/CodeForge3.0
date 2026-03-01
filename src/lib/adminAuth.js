// Client-side admin authentication utilities
// Use this file in client components ('use client')

const ADMIN_TOKEN_KEY = 'admin_token';

/**
 * Get the admin authentication token from localStorage
 * @returns {string|null} The admin token or null if not found
 */
export function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

/**
 * Set the admin authentication token in localStorage
 * @param {string} token - The token to store
 */
export function setAdminToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

/**
 * Remove the admin authentication token from localStorage
 */
export function removeAdminToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/**
 * Check if admin is authenticated (has token)
 * @returns {boolean} True if token exists, false otherwise
 */
export function hasAdminToken() {
  return !!getAdminToken();
}
