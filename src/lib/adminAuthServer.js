// Server-side admin authentication utilities
// Use this file in API routes and server components

import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Verify admin credentials against environment variables
 * @param {string} username - The username to verify
 * @param {string} password - The password to verify
 * @returns {boolean} True if credentials match, false otherwise
 */
export function verifyAdminCredentials(username, password) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminUsername || !adminPassword) {
    console.error('Admin credentials not configured in environment variables');
    return false;
  }
  
  return username === adminUsername && password === adminPassword;
}

/**
 * Create an admin authentication token
 * @param {string} username - The admin username
 * @returns {string} Base64-encoded token with expiry
 */
export function createAdminToken(username) {
  const secretKey = process.env.ADMIN_SECRET_KEY || 'default-secret-key';
  const expiresAt = Date.now() + TOKEN_EXPIRY;
  
  const tokenData = {
    username,
    expiresAt,
    secret: secretKey
  };
  
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

/**
 * Verify an admin authentication token
 * @param {string} token - The token to verify
 * @returns {boolean} True if token is valid and not expired, false otherwise
 */
export function verifyAdminToken(token) {
  try {
    const secretKey = process.env.ADMIN_SECRET_KEY || 'default-secret-key';
    const tokenData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    
    // Check if token is expired
    if (Date.now() > tokenData.expiresAt) {
      return false;
    }
    
    // Check if secret matches
    if (tokenData.secret !== secretKey) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

/**
 * Check if the current request is from an authenticated admin
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME);
  
  if (!token) {
    return false;
  }
  
  return verifyAdminToken(token.value);
}

/**
 * Set the admin authentication cookie
 * @param {string} token - The token to set in cookie
 */
export async function setAdminCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY / 1000, // Convert to seconds
    path: '/'
  });
}

/**
 * Remove the admin authentication cookie
 */
export async function removeAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
