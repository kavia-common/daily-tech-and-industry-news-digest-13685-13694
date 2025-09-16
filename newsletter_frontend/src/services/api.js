//
// API client for newsletter_frontend
//
// This file provides a small wrapper around fetch with base URL handling,
// JSON parsing, error handling, and typed helper methods specific to the
// newsletter admin dashboard.
//
// PUBLIC_INTERFACE
export class ApiClient {
  /**
   * Create an API client
   * @param {object} options
   * @param {string} [options.baseUrl] - Base URL for API (from env if not provided)
   * @param {object} [options.fetchImpl] - Custom fetch (for tests)
   */
  constructor({ baseUrl, fetchImpl } = {}) {
    // In CRA, environment variables must be prefixed with REACT_APP_
    // Please set REACT_APP_API_BASE_URL in the environment.
    this.baseUrl =
      baseUrl ||
      (typeof process !== "undefined" &&
        process.env &&
        process.env.REACT_APP_API_BASE_URL) ||
      "";
    this.fetchImpl = fetchImpl || fetch;
  }

  _buildUrl(path, query) {
    const base = this.baseUrl.replace(/\/+$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(base + p, window.location.origin);
    if (query && typeof query === "object") {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          url.searchParams.append(k, String(v));
        }
      });
    }
    return url.toString();
  }

  async _request(path, { method = "GET", query, body, headers } = {}) {
    const url = this._buildUrl(path, query);
    const init = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
    };
    if (body !== undefined) {
      init.body = typeof body === "string" ? body : JSON.stringify(body);
    }
    const res = await this.fetchImpl(url, init);
    const contentType = res.headers.get("content-type") || "";
    let data = null;
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    if (!res.ok) {
      const err = new Error(
        `API error ${res.status}: ${res.statusText} ${typeof data === "string" ? data : JSON.stringify(data)}`
      );
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch dashboard stats: totals, success/failure counts, latest run, etc.
   * Expected response example:
   * {
   *   totals: { sent: 1200, opens: 430, clicks: 120 },
   *   latestRun: { id: "2025-09-15", startedAt: "...", status: "success" },
   *   byVertical: [{ name: "Technology", sent: 400 }, ...]
   * }
   */
  async getStats() {
    return this._request("/api/stats");
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch run logs with optional pagination and day filter.
   * @param {{page?:number, pageSize?:number, date?:string}} params
   * Expected response example:
   * { items: [ { id, date, status, durationMs, errors: [] } ], total: 42 }
   */
  async getRunLogs(params = {}) {
    return this._request("/api/logs", { query: params });
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch list of archived newsletters.
   * @param {{page?:number, pageSize?:number, vertical?:string, q?:string}} params
   * Returns: { items: [{ id, date, title, verticals:[], format:"html|md" }], total }
   */
  async getArchive(params = {}) {
    return this._request("/api/archive", { query: params });
  }

  // PUBLIC_INTERFACE
  /**
   * Fetch newsletter content by ID.
   * @param {string} id
   * Returns: { id, date, title, html?: string, markdown?: string, json?: object, metadata?: object }
   */
  async getNewsletter(id) {
    return this._request(`/api/newsletters/${encodeURIComponent(id)}`);
  }

  // PUBLIC_INTERFACE
  /**
   * Optional: save metadata or editorial notes for a newsletter (foundation for future editing).
   * @param {string} id
   * @param {object} payload
   * Returns: { ok: true }
   */
  async saveNewsletterMeta(id, payload) {
    return this._request(`/api/newsletters/${encodeURIComponent(id)}/meta`, {
      method: "POST",
      body: payload,
    });
  }
}

// Singleton for app usage
const defaultClient = new ApiClient();
export default defaultClient;
