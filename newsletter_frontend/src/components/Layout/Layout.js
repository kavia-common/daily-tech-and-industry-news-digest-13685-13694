import React from "react";
import "./layout.css";

// PUBLIC_INTERFACE
export function Navbar({ title = "Newsletter Admin" }) {
  /** Top navigation bar */
  return (
    <nav className="nav">
      <div className="nav-brand">{title}</div>
      <div className="nav-actions">
        <a href="#/" className="nav-link">
          Dashboard
        </a>
        <a href="#/logs" className="nav-link">
          Logs
        </a>
        <a href="#/archive" className="nav-link">
          Archive
        </a>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
export function Container({ children }) {
  /** Main content container */
  return <div className="container">{children}</div>;
}
