const fs = require('fs');
const path = require('path');

const API_URL = 'https://mykarabot.info/api.php';
const DATA_FILE = path.join(__dirname, '../dashboard/data.json');

async function migrate() {
    const raw = fs.readFileSync(DATA_FILE);
    const data = JSON.parse(raw);
    
    const projectMap = {
        'tech-tips': 'CONTENT',
        'magic-shop-made': 'OPS',
        'project-tracking': 'SYSTEM',
        'dreamwav': 'NEXUS',
        'dreamwav-nexus': 'NEXUS',
        'sleepover-live': 'ARCH'
    };

    console.log(`Found ${data.projects.length} projects. Migrating tasks...`);

    for (const project of data.projects) {
        const tag = projectMap[project.id] || 'GENERIC';
        
        for (const task of project.tasks) {
            const newTask = {
                id: 'legacy_' + task.id + '_' + Date.now() + Math.floor(Math.random()*1000),
                title: task.text,
                status: task.done ? 'done' : 'todo',
                tag: tag,
                assignee: 'KARA', // Defaulting to me for legacy items
                notes: `Imported from ${project.name}`
            };

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTask)
                });
                const result = await res.json();
                console.log(`Migrated: ${newTask.title} -> ${result.message}`);
            } catch (e) {
                console.error(`Failed to migrate ${newTask.title}:`, e.message);
            }
        }
    }
}

migrate();
