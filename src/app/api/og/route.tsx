import { ImageResponse } from "@vercel/og";
import { getDefaultOgImageUrl } from "@/lib/og";

export const runtime = "edge";
export const revalidate = 3600;

const size = {
  width: 1200,
  height: 630,
};

const contentType = "image/png";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "EJ Development - El Madronal";
  const subtitle = searchParams.get("subtitle") || "Marbella · Private Estate";
  const highlight =
    searchParams.get("highlight") || "Private Estate · Panoramic Views";
  const badge = searchParams.get("badge") || "Exclusive";
  const image = searchParams.get("image") || getDefaultOgImageUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          fontFamily: "Georgia, serif",
          color: "#f7f7f7",
          background: "#050505",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(100deg, rgba(0,0,0,0.82) 18%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "48px 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: 26,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.96,
              }}
            >
              EJ Development
            </div>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.75)",
                padding: "8px 16px",
                borderRadius: 9999,
                fontSize: 20,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              {badge}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 72,
                lineHeight: 1.06,
                fontWeight: 500,
                maxWidth: "82%",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 30,
                opacity: 0.9,
                letterSpacing: "0.04em",
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: 0.92,
            }}
          >
            {highlight}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "content-type": contentType,
        "cache-control":
          "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
