import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Container } from "../components/Layout/Layout";
import "../components/Layout/layout.css";
import { formatDate, msToHuman } from "../utils/format";
import { debounce } from "../utils/debounce";

// PUBLIC_INTERFACE
export default function Logs() {
  /**
   * Logs page provides a simple run log table with pagination and filters.
   */
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchLogs = async (opts = {}) => {
    try {
      setLoading(true);
      const data = await api.getRunLogs({
        page,
        pageSize,
        date,
        ...opts,
      });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const debouncedReload = useMemo(() => debounce(fetchLogs, 400), []);

  return (
    <Container>
      <h2>Run Logs</h2>
      <div className="card">
        <div className="row" style={{ marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>Date</label>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                debouncedReload({ page: 1 });
                setPage(1);
              }}
            />
          </div>
          <div>
            <button
              className="btn"
              onClick={() => {
                setDate("");
                fetchLogs({ page: 1, date: "" });
                setPage(1);
              }}
            >
              Clear
            </button>
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
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{formatDate(r.date)}</td>
                    <td>
                      <span className="badge">{r.status}</span>
                    </td>
                    <td>{msToHuman(r.durationMs)}</td>
                    <td>
                      {Array.isArray(r.errors) && r.errors.length > 0 ? (
                        <details>
                          <summary>{r.errors.length} error(s)</summary>
                          <pre className="code">
                            {r.errors.map((e, idx) => `• ${e}\n`)}
                          </pre>
                        </details>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No logs found.
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
