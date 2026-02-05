const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Content Ideas
const contentBatch = [
  {
    title: "Stop Using ChatGPT Like Google.",
    body: "Treat it like an intern.<br>❌ 'Write an email.'<br>✅ 'Act as a senior copywriter. Write a 50-word urgent email.'",
    filename: "post-001-chatgpt.png"
  },
  {
    title: "Stop Making Slides Manually.",
    body: "Stop wrestling with PowerPoint.<br>👉 <strong>Gamma</strong> turns notes into a full deck in 30s.<br>⚡️ Just type: 'Pitch deck for a coffee shop' ➡️ Done.",
    filename: "post-002-gamma.png"
  },
  {
    title: "Overwhelmed? Use Goblin Tools.",
    body: "The 'Magic To-Do' button breaks complex tasks into tiny steps.<br>🧠 'Clean the house' ➡️ 'Pick up trash', 'Wash dishes'.<br>Free & life-saving.",
    filename: "post-003-goblin.png"
  }
];

console.log("🚀 Starting Content Factory...");

// We will use the 'browser' tool via the agent loop manually for now, 
// or I can automate it if I had the SDK. 
// Since I am the agent, I will just output the instructions for myself.

console.log("--- BATCH INSTRUCTIONS ---");
contentBatch.forEach(item => {
  const url = `file://${path.join(__dirname, 'template-card.html')}?title=${encodeURIComponent(item.title)}&body=${encodeURIComponent(item.body)}`;
  console.log(`\n📸 GENERATE: ${item.filename}`);
  console.log(`URL: ${url}`);
});
