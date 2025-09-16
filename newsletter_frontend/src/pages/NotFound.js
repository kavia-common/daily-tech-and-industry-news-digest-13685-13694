import React from "react";
import { Container } from "../components/Layout/Layout";

// PUBLIC_INTERFACE
export default function NotFound() {
  /** Displayed when route cannot be resolved */
  return (
    <Container>
      <h2>Not Found</h2>
      <p>The page you requested could not be found.</p>
    </Container>
  );
}
