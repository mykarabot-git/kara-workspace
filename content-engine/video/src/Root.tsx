import { Composition } from "remotion";
import { TechTipVideo, myCompSchema } from "./TechTipVideo";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TechTip"
        component={TechTipVideo}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1080}
        height={1920} // TikTok/Reels Portrait
        schema={myCompSchema}
        defaultProps={{
          title: "Stop Making Slides Manually.",
          toolName: "Use Gamma",
          payoff: "Done in 30 seconds. ⚡️",
          bgColor: "#0d1117",
          accentColor: "#a855f7",
        }}
      />
    </>
  );
};
