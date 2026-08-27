/**
 * Utility to get the backend API URL across development and production.
 * 
 * 1. Production with Domain (e.g., https://api.yourdomain.com):
 *    - Uses standard DNS resolution with 0ms IPv6 timeout.
 * 
 * 2. Production with Private Network (Docker / K8s / VPC):
 *    - Allows `INTERNAL_API_URL` or `API_URL` (e.g., http://backend:8080) for ultra-fast
 *      Server-to-Server communication bypassing public internet & SSL overhead.
 * 
 * 3. Local Development (localhost):
 *    - Automatically transforms 'localhost' to '127.0.0.1' on server-side to prevent
 *      the 2-3s IPv6 (::1) lookup timeout on Windows/Node 18+.
 */
export function getBackendApiUrl(): string {
  // 1. Server-side private internal network override (Docker, Kubernetes, VPC)
  if (typeof window === "undefined") {
    const internalUrl = process.env.INTERNAL_API_URL || process.env.API_URL;
    if (internalUrl) return internalUrl;
  }

  // 2. Standard public API URL (domain or IP)
  const url = process.env.NEXT_PUBLIC_API_URL || "https://127.0.0.1:7067";

  // 3. Localhost IPv6 fallback guard for local development
  if (typeof window === "undefined" && url.includes("://localhost:")) {
    return url.replace("://localhost:", "://127.0.0.1:");
  }

  return url;
}
