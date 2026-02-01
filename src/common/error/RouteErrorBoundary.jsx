// RouteErrorBoundary.jsx
import { useRouteError } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  console.error("Route error:", error);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Something went wrong</h1>
      <h2>Try again later</h2>
      {/* <p>{error?.message || "Unexpected error"}</p> */}
    </div>
  );
}
