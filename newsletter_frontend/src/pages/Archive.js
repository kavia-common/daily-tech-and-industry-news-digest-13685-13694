import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Container } from "../components/Layout/Layout";
import "../components/Layout/layout.css";
import { formatDate } from "../utils/format";
import { debounce } from "../utils/debounce";

// PUBLIC_INTERFACE
export default function Archive() {
  /**
   * Archive page provides a searchable, paginated list of archived newsletters.
   */
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [vertical, setVertical] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchArchive = async (opts = {}) => {
    try {
      setLoading(true);
      const data = await api.getArchive({
        page,
        pageSize,
        vertical,
        q,
        ...opts,
      });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to load archive");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const debouncedReload = useMemo(() => debounce(fetchArchive, 400), []);

  return (
    <Container>
      <h2>Archive</h2>
      <div className="card">
        <div className="row" style={{ marginBottom: 12 }}>
          <div style={{ minWidth: 220 }}>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>
              Search
            </label>
            <input
              className="input"
              placeholder="title or id..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                debouncedReload({ page: 1, q: e.target.value });
                setPage(1);
              }}
            />
          </div>
          <div style={{ minWidth: 200 }}>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>
              Vertical
            </label>
            <select
              className="select"
              value={vertical}
              onChange={(e) => {
                setVertical(e.target.value);
                debouncedReload({ page: 1, vertical: e.target.value });
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="Technology">Technology</option>
              <option value="Automotive">Automotive</option>
              <option value="Semiconductors">Semiconductors</option>
            </select>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span className="badge">Total: {total}</span>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {!loading && !err && (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Verticals</th>
                  <th>Format</th>
                  <th>Open</th>
                </tr>
              </thead>
              <tbody>
                {items.map((n) => (
                  <tr key={n.id}>
                    <td>{n.id}</td>
                    <td>{formatDate(n.date)}</td>
                    <td>{n.title}</td>
                    <td>{Array.isArray(n.verticals) ? n.verticals.join(", ") : "-"}</td>
                    <td>
                      <span className="badge">{n.format || "-"}</span>
                    </td>
                    <td>
                      <a className="btn secondary" href={`#/newsletter/${encodeURIComponent(n.id)}`}>
                        View
                      </a>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No archive items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="row" style={{ marginTop: 12, justifyContent: "flex-end" }}>
          <button
            className="btn secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="badge">Page {page}</span>
          <button
            className="btn secondary"
            disabled={page * pageSize >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </Container>
  );
}
