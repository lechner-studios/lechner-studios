"use client";
import { useEffect } from "react";
import { initClientMonitoring } from "../lib/monitoring/client";

// Mounts once in the locale layout. initClientMonitoring is a no-op unless
// NEXT_PUBLIC_SENTRY_DSN is set, so this renders nothing and costs nothing in
// the default (DSN-unset) deploy.
export default function SentryInit() {
  useEffect(() => {
    void initClientMonitoring();
  }, []);
  return null;
}
