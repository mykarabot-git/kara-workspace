const fs = require('fs');
const path = require('path');

const API_URL = 'https://mykarabot.info/api.php';
const CACHE_FILE = path.join(__dirname, '.kanban-cache.json');

async function checkBoard() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('API Error');
        const tasks = await res.json();

        // Load cache
        let cache = [];
        if (fs.existsSync(CACHE_FILE)) {
            cache = JSON.parse(fs.readFileSync(CACHE_FILE));
        }

        // Check for new tasks assigned to KARA
        const newTasks = tasks.filter(t => 
            t.assignee === 'KARA' && 
            !cache.includes(t.id) &&
            t.status !== 'done' // Ignore completed tasks
        );

        if (newTasks.length > 0) {
            console.log('\n🚨 [MISSION ALERT] New tasks assigned to KARA:');
            newTasks.forEach(t => {
                console.log(`- [${t.tag}] ${t.title}`);
            });
            
            // Here we could trigger a system notification or auto-start a sub-agent
        }

        // Update cache (store all IDs)
        const currentIds = tasks.map(t => t.id);
        fs.writeFileSync(CACHE_FILE, JSON.stringify(currentIds));

    } catch (e) {
        // Silent fail on network error to avoid spam
    }
}

// Run immediately
checkBoard();
