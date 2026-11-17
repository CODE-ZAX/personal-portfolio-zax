import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const AdminRoot = lazy(() => import("./admin/AdminRoot"));

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element missing");
}

const path = window.location.pathname;
const admin = path === "/admin" || path.startsWith("/admin/");

createRoot(root).render(
  <StrictMode>
    {admin ? (
      <Suspense fallback={<div className="min-h-[100dvh] bg-graphite" />}>
        <AdminRoot />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
