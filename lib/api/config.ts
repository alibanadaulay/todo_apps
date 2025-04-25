// Use the same protocol as the current page
const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
const host = 'localhost:8080';

// Ensure we're using HTTP for local development
export const API_BASE_URL = `http://${host}`;

export const API_ENDPOINTS = {
  TASKS: '/api/v1/tasks',
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}; 