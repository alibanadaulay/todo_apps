// Use the same protocol as the current page
const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
const host = 'todobe-production-e862.up.railway.app';

// Ensure we're using HTTP for local development
export const API_BASE_URL = `https://${host}`;

export const API_ENDPOINTS = {
  TASKS: '/api/v1/tasks',
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}; 