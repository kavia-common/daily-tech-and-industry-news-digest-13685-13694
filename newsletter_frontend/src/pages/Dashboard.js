import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Container } from "../components/Layout/Layout";
import "../components/Layout/layout.css";
import { formatNumber, formatDate } from "../utils/format";

// PUBLIC_INTERFACE
export default function Dashboard() {
  /**
   * Dashboard page displays basic newsletter stats and latest run info.
   */
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.getStats();
        if (!mounted) return;
        setStats(data);
        setError("");
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed to load stats");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Container>
      <h2>Dashboard</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && !error && stats && (
        <>
          <div className="grid">
            <div className="card col-4">
              <div className="card-title">Sent</div>
              <div className="kpi">
                {formatNumber(stats?.totals?.sent ?? 0)}
              </div>
            </div>
            <div className="card col-4">
              <div className="card-title">Opens</div>
              <div className="kpi">
                {formatNumber(stats?.totals?.opens ?? 0)}
              </div>
            </div>
            <div className="card col-4">
              <div className="card-title">Clicks</div>
              <div className="kpi">
                {formatNumber(stats?.totals?.clicks ?? 0)}
              </div>
            </div>
            <div className="card col-6">
              <div className="card-title">Latest Run</div>
              <div>
                <div>
                  <strong>ID:</strong> {stats?.latestRun?.id || "-"}
                </div>
                <div>
                  <strong>Started:</strong>{" "}
                  {formatDate(stats?.latestRun?.startedAt)}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className="badge">{stats?.latestRun?.status || "-"}</span>
                </div>
              </div>
            </div>
            <div className="card col-6">
              <div className="card-title">By Vertical</div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Vertical</th>
                    <th>Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.byVertical || []).map((v) => (
                    <tr key={v.name}>
                      <td>{v.name}</td>
                      <td>{formatNumber(v.sent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
