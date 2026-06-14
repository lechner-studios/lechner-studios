import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurz offline | Lechner Studios",
  description: "Wir aktualisieren gerade Inhalte und kommen in Kürze zurück.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main style={{
      fontFamily: "'Cormorant', Georgia, serif",
      background: "#F7F8F8", color: "#15171A",
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: 24, margin: 0, textAlign: "center",
    }}>
      <div style={{ maxWidth: 520 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
          gap: 4, width: 56, height: 56, margin: "0 auto 32px",
        }} aria-hidden="true">
          <div style={{ background: "#D6CDBE", borderRadius: 2 }} />
          <div style={{ background: "#8FA8C5", borderRadius: 2 }} />
          <div style={{ background: "#254268", borderRadius: 2 }} />
          <div style={{ background: "#5E8263", borderRadius: 2 }} />
        </div>
        <h1 style={{ fontWeight: 700, fontSize: 48, letterSpacing: "-0.02em", marginBottom: 24 }}>
          Kurz offline
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "#5B6168", marginBottom: 16 }}>
          Wir aktualisieren gerade Inhalte und kommen in Kürze zurück.
        </p>
        <p style={{ fontSize: 19, lineHeight: 1.55, color: "#5B6168", marginBottom: 16 }}>
          We&apos;re updating our content and will be back shortly.
        </p>
        <div style={{
          marginTop: 56, fontFamily: "'Cormorant', serif", fontWeight: 700, fontSize: 16,
          letterSpacing: "-0.025em", color: "#15171A",
        }}>
          lechner
          <span style={{ color: "#B8944D", fontFamily: "'Italiana', serif", fontWeight: 400 }}>.</span>
          <span style={{ fontFamily: "'Italiana', serif", fontWeight: 400 }}>studios</span>
        </div>
      </div>
    </main>
  );
}
