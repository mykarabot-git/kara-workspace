// const fetch = require('node-fetch'); // Native fetch in Node 18+

const API_URL = 'https://mykarabot.info/api.php';

async function callApi(method, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data) options.body = JSON.stringify(data);
    
    const res = await fetch(API_URL + (method === 'DELETE' ? '?id=' + data.id : ''), options);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
}

// Commands
const commands = {
    list: async () => {
        const tasks = await callApi('GET');
        console.log(JSON.stringify(tasks, null, 2));
    },
    add: async (args) => {
        const task = {
            id: 't' + Date.now(),
            title: args.title,
            status: args.status || 'todo',
            tag: args.tag || 'GENERIC',
            assignee: args.assignee || 'KARA',
            notes: args.notes || ''
        };
        await callApi('POST', task);
        console.log(`Task created: ${task.id}`);
    },
    update: async (args) => {
        // Need existing task data first to not overwrite fields with null
        // For MVP, we assume args contains all fields or we handle partials in PHP (PHP script currently expects full object)
        // I will fetch, merge, then push.
        const all = await callApi('GET');
        const existing = all.find(t => t.id === args.id);
        if (!existing) {
            console.error("Task not found");
            return;
        }
        const merged = { ...existing, ...args };
        await callApi('POST', merged);
        console.log(`Task updated: ${args.id}`);
    },
    delete: async (args) => {
        await callApi('DELETE', { id: args.id });
        console.log(`Task deleted: ${args.id}`);
    }
};

// Main
(async () => {
    const [cmd, jsonArgs] = process.argv.slice(2);
    if (!commands[cmd]) {
        console.error("Unknown command");
        process.exit(1);
    }
    try {
        const args = jsonArgs ? JSON.parse(jsonArgs) : {};
        await commands[cmd](args);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
