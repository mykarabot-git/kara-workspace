#!/bin/bash
npx remotion render src/index.ts TechTip out/video-gamma.mp4 \
  --props='{"title": "Stop Making Slides Manually.", "toolName": "Use Gamma App", "payoff": "Finished in 30 seconds. ⚡️", "bgColor": "#000000", "accentColor": "#a855f7"}'
