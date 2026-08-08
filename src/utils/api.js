/**
 * AdminWing Secure Fetch Utility
 * Automatically injects Authorization Bearer tokens, checks JWT session expiry,
 * and handles 401/403 security redirects gracefully.
 */

export async function secureFetch(url, options = {}) {
  const token = localStorage.getItem("turing_wings_token");
  const savedUser = localStorage.getItem("turing_wings_user");

  // Validate session expiration timestamp
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.expiresAt && Date.now() > parsedUser.expiresAt) {
        localStorage.removeItem("turing_wings_token");
        localStorage.removeItem("turing_wings_user");
        window.location.href = "/login";
        throw new Error("Session expired. Please sign in again.");
      }
    } catch {
      // Invalid JSON format in session storage
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("turing_wings_token");
    localStorage.removeItem("turing_wings_user");
    window.location.href = "/login";
    throw new Error("Unauthorized access. Security session cleared.");
  }

  return response;
}

/** Helper function to deduplicate array of items by slug, name, or _id */
export function deduplicateItems(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item) return false;
    const identifier = (item.slug || item.name || item._id || "").toString().toLowerCase().trim();
    if (!identifier || seen.has(identifier)) return false;
    seen.add(identifier);
    return true;
  });
}
