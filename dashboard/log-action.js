// Log Action Script
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

function logAction(actionText, updates = {}) {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    // 1. Add to Activity Feed
    const today = new Date().toISOString().split('T')[0];
    data.activity.unshift({
      date: today,
      icon: "🤖",
      text: actionText
    });
    
    // Limit feed to 10 items
    if (data.activity.length > 10) data.activity.pop();

    // 2. Apply Updates (Tasks/Projects)
    if (updates.completeTask) {
      // Find task by text match (fuzzy)
      data.projects.forEach(p => {
        p.tasks.forEach(t => {
          if (t.text.toLowerCase().includes(updates.completeTask.toLowerCase())) {
            t.done = true;
          }
        });
      });
    }

    if (updates.addTask) {
      const p = data.projects.find(p => p.id === updates.addTask.projectId);
      if (p) {
        p.tasks.push({
          id: Date.now(),
          text: updates.addTask.text,
          done: false
        });
      }
    }

    // 3. Save
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log("✅ Dashboard updated: " + actionText);
    
  } catch (e) {
    console.error("Error updating dashboard:", e);
  }
}

// Execute logic based on args
const args = process.argv.slice(2);
// Usage: node log-action.js "Activity Text" --complete "Task Text"
// For now, I'll hardcode the current update logic here to run it once.

logAction("Generated first automated content piece (ChatGPT Tips)", {
  completeTask: "Build content strategy",
  addTask: { projectId: "tech-tips", text: "Post 'ChatGPT Tips' to Instagram" }
});
