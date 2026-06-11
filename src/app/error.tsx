"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Next.js Route Error Boundary
 * Catches unexpected errors at the route level and provides
 * a structured recovery UI with error context logging.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log structured error context for debugging
  console.error("[OWL-ORCA Route Error]", {
    message: error.message,
    digest: error.digest,
    stack: error.stack?.split("\n").slice(0, 5).join("\n"),
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      <div
        className="p-8 rounded-2xl max-w-lg text-center"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "16px",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.10)",
        }}
      >
        <AlertTriangle
          className="w-12 h-12 mx-auto mb-4"
          style={{
            color: "#f59e0b",
            filter: "brightness(1.4) drop-shadow(0 0 8px currentColor)",
          }}
        />
        <h2
          className="text-xl font-bold mb-2"
          style={{
            color: "#00d4ff",
            textShadow: "0 0 20px rgba(0, 212, 255, 0.15)",
          }}
        >
          Something went wrong
        </h2>
        <p className="text-foreground/90 mb-2">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="text-xs text-foreground/50 mb-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{
            background: "rgba(0, 212, 255, 0.15)",
            border: "1px solid rgba(0, 212, 255, 0.50)",
            color: "#00d4ff",
          }}
          aria-label="Try again"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
