import { ImageResponse } from "next/og";

export const alt = "Horquva: we build the software and AI systems businesses depend on.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#15120F",
          color: "#F3EFE7",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#A9825A" }}>HORQUVA</div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.02, letterSpacing: -2, maxWidth: 980 }}>
          We build the software and AI systems businesses depend on.
        </div>
      </div>
    ),
    size,
  );
}
