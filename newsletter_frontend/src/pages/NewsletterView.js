import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Container } from "../components/Layout/Layout";
import "../components/Layout/layout.css";

// PUBLIC_INTERFACE
export default function NewsletterView({ id }) {
  /**
   * NewsletterView shows a single newsletter with HTML and Markdown rendering.
   * Provides a simple metadata editor as a foundation for future features.
   */
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("html"); // 'html' | 'markdown' | 'json'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // optional meta editing
  const [metaDraft, setMetaDraft] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const d = await api.getNewsletter(id);
        if (!mounted) return;
        setData(d);
        setErr("");
        setMetaDraft(
          JSON.stringify(d?.metadata || { notes: "" }, null, 2)
        );
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "Failed to load newsletter");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const onSaveMeta = async () => {
    try {
      let payload = {};
      try {
        payload = JSON.parse(metaDraft || "{}");
      } catch (e) {
        alert("Metadata must be valid JSON.");
        return;
      }
      await api.saveNewsletterMeta(id, payload);
      alert("Saved.");
    } catch (e) {
      alert(e.message || "Failed to save");
    }
  };

  const hasHtml = !!data?.html;
  const hasMd = !!data?.markdown;
  const hasJson = !!data?.json;

  return (
    <Container>
      <h2>Newsletter: {id}</h2>
      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {!loading && !err && data && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="row">
              <div style={{ fontWeight: 700 }}>{data.title || "(untitled)"}</div>
              <div className="badge">{data.date || "-"}</div>
              <div style={{ marginLeft: "auto" }}>
                <div className="row">
                  <button
                    className="btn secondary"
                    onClick={() => setMode("html")}
                    disabled={!hasHtml}
                    title={hasHtml ? "Show HTML" : "No HTML available"}
                  >
                    HTML
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => setMode("markdown")}
                    disabled={!hasMd}
                    title={hasMd ? "Show Markdown" : "No Markdown available"}
                  >
                    Markdown
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => setMode("json")}
                    disabled={!hasJson}
                    title={hasJson ? "Show JSON" : "No JSON available"}
                  >
                    JSON
                  </button>
                </div>
              </div>
            </div>
          </div>

          {mode === "html" && hasHtml && (
            <div className="card">
              {/* DangerouslySetInnerHTML is acceptable for trusted server-side rendered newsletter HTML */}
              <div dangerouslySetInnerHTML={{ __html: data.html }} />
            </div>
          )}

          {mode === "markdown" && hasMd && (
            <div className="card">
              {/* Simple pre block display. Could integrate a Markdown renderer later */}
              <pre className="code">{data.markdown}</pre>
            </div>
          )}

          {mode === "json" && hasJson && (
            <div className="card">
              <pre className="code">{JSON.stringify(data.json, null, 2)}</pre>
            </div>
          )}

          <div className="grid" style={{ marginTop: 16 }}>
            <div className="card col-12">
              <div className="card-title">Metadata (optional editor)</div>
              <p style={{ marginTop: 0, color: "var(--muted)" }}>
                You can store internal notes or overrides here. This is a foundation for future editorial features.
              </p>
              <textarea
                className="input"
                style={{ minHeight: 180, fontFamily: "monospace" }}
                value={metaDraft}
                onChange={(e) => setMetaDraft(e.target.value)}
                placeholder='{"notes":"..."}'
              />
              <div className="row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                <button className="btn" onClick={onSaveMeta}>Save Metadata</button>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
