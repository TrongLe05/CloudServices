/**
 * Utility to get the backend API URL.
 * When called on the server side (Node.js runtime), transforms 'localhost' to '127.0.0.1'
 * to avoid the 2-3 second IPv6 (::1) connection timeout on Windows/Node 18+.
 */
export function getBackendApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7067";
  if (typeof window === "undefined") {
    return url.replace("://localhost:", "://127.0.0.1:");
  }
  return url;
}
