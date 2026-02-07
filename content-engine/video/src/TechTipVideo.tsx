import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Schema for dynamic props
export const myCompSchema = z.object({
  title: z.string(),
  toolName: z.string(),
  payoff: z.string(),
  bgColor: zColor(),
  accentColor: zColor(),
});

export const TechTipVideo: React.FC<z.infer<typeof myCompSchema>> = ({
  title,
  toolName,
  payoff,
  bgColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const titleOpacity = spring({ frame, fps, config: { damping: 100 } });
  const toolScale = spring({ frame: frame - 60, fps }); // Starts at 2s
  const payoffY = spring({ frame: frame - 120, fps }); // Starts at 4s

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        color: "white",
        fontFamily: "Inter, sans-serif",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 40,
      }}
    >
      {/* Scene 1: Problem/Title */}
      <Sequence from={0} durationInFrames={180}>
        <h1
          style={{
            opacity: titleOpacity,
            fontSize: 80,
            fontWeight: 800,
            maxWidth: "80%",
          }}
        >
          {title}
        </h1>
      </Sequence>

      {/* Scene 2: The Solution */}
      <Sequence from={60}>
        <div
          style={{
            transform: `scale(${toolScale})`,
            marginTop: 50,
            fontSize: 60,
            fontWeight: 600,
            color: accentColor,
            background: "rgba(255,255,255,0.1)",
            padding: "20px 40px",
            borderRadius: 20,
            border: `2px solid ${accentColor}`,
          }}
        >
          👉 {toolName}
        </div>
      </Sequence>

      {/* Scene 3: The Payoff */}
      <Sequence from={120}>
        <div
          style={{
            transform: `translateY(${interpolate(payoffY, [0, 1], [50, 0])}px)`,
            opacity: payoffY,
            marginTop: 60,
            fontSize: 50,
            color: "#9ca3af",
          }}
        >
          {payoff}
        </div>
      </Sequence>
      
      {/* Branding */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', paddingBottom: 50, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
           <div style={{ fontSize: 30 }}>🚀</div>
           <div style={{ fontSize: 24, fontWeight: 600 }}>@TechTipsByMelody</div>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
