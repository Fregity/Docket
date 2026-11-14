import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DueBird — Free Homework Planner for Students";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          background: "#f7f6f1",
          color: "#1a1a18",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: "#252820",
              color: "#f7f6f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            D
          </div>
          DueBird
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 950 }}>
          <div
            style={{
              color: "#737568",
              fontSize: 22,
              letterSpacing: "5px",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Made for students
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 76,
              lineHeight: 1.08,
              letterSpacing: "-3px",
              fontWeight: 500,
            }}
          >
            Your classes.
            <br />
            Your assignments.
            <br />
            All in one place.
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 28,
              color: "#66685e",
            }}
          >
            A free homework planner built for students.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #deded5",
            paddingTop: 22,
            fontSize: 22,
            color: "#55584d",
          }}
        >
          <span>myduebird.com</span>
          <span>Stop asking the group chat.</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
