import Link from "next/link";

/**
 * 404 Not Found Page
 * Since OWL-ORCA is a single-page app, all paths should redirect
 * to the home page. This provides a clean fallback.
 */
export default function NotFound() {
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
        <p
          className="text-6xl font-black mb-4"
          style={{
            background: "linear-gradient(to right, #00d4ff, #10b981, #e040fb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>
        <h2
          className="text-xl font-bold mb-2"
          style={{
            color: "#00d4ff",
            textShadow: "0 0 20px rgba(0, 212, 255, 0.15)",
          }}
        >
          Page Not Found
        </h2>
        <p className="text-foreground/80 mb-6">
          The page you&apos;re looking for doesn&apos;t exist. OWL-ORCA is a
          single-page application — everything is on the home page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{
            background: "rgba(0, 212, 255, 0.15)",
            border: "1px solid rgba(0, 212, 255, 0.50)",
            color: "#00d4ff",
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
