const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const USAGE_FILE = path.join(__dirname, '../dashboard/usage.json');
const HISTORY_FILE = path.join(__dirname, '../dashboard/usage-history.json');

// Load existing data
let usageData = { summary: {}, models: {}, history: {} };
let historyData = { daily: [], monthly: [], allTime: { totalCost: 0, totalTokens: 0 } };

try {
    if (fs.existsSync(USAGE_FILE)) {
        usageData = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf-8'));
    }
    if (fs.existsSync(HISTORY_FILE)) {
        historyData = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    }
} catch (e) {
    console.log('Creating new usage files...');
}

// Get current session data
try {
    const output = execSync('openclaw sessions list --json', { encoding: 'utf-8', timeout: 5000 });
    const data = JSON.parse(output);

    const modelStats = {};
    let currentSessionCost = 0;
    let currentSessionTokens = 0;

    // Approximate costs per 1M tokens
    const RATES = {
        'claude-opus': 15.00,
        'claude-sonnet': 3.00,
        'claude-haiku': 0.80,
        'gpt-5': 10.00,
        'gpt-4': 30.00,
        'gemini': 0.50,
        'glm': 0.00,
        'kimi': 0.00,
        'qwen': 0.00,
        'grok': 2.00,
        'default': 1.00
    };

    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7); // '2026-02'

    data.sessions.forEach(session => {
        const modelName = session.model || 'Unknown';
        const displayName = modelName.split('/').pop().split(':')[0];
        
        if (!modelStats[displayName]) {
            modelStats[displayName] = {
                provider: modelName.includes('ollama') ? 'local' : 'cloud',
                activeSessions: 0,
                totalTokens: 0,
                cost: 0
            };
        }

        modelStats[displayName].activeSessions += 1;
        modelStats[displayName].totalTokens += (session.totalTokens || 0);

        // Estimate cost
        let rate = RATES.default;
        for (const [key, val] of Object.entries(RATES)) {
            if (modelName.toLowerCase().includes(key)) rate = val;
        }
        
        const sessionCost = ((session.totalTokens || 0) / 1000000) * rate;
        modelStats[displayName].cost += sessionCost;
        currentSessionCost += sessionCost;
        currentSessionTokens += (session.totalTokens || 0);
    });

    // Update all-time totals
    historyData.allTime.totalCost = (historyData.allTime.totalCost || 0) + currentSessionCost;
    historyData.allTime.totalTokens = (historyData.allTime.totalTokens || 0) + currentSessionTokens;

    // Update daily record for today
    const todayEntry = historyData.daily.find(d => d.date === today);
    if (todayEntry) {
        todayEntry.cost += currentSessionCost;
        todayEntry.tokens += currentSessionTokens;
        todayEntry.sessions = data.sessions.length;
    } else {
        historyData.daily.push({
            date: today,
            cost: currentSessionCost,
            tokens: currentSessionTokens,
            sessions: data.sessions.length
        });
    }

    // Keep only last 30 days
    historyData.daily = historyData.daily.slice(-30);

    // Update monthly record
    const monthEntry = historyData.monthly.find(m => m.month === currentMonth);
    if (monthEntry) {
        monthEntry.cost += currentSessionCost;
        monthEntry.tokens += currentSessionTokens;
    } else {
        historyData.monthly.push({
            month: currentMonth,
            cost: currentSessionCost,
            tokens: currentSessionTokens
        });
    }

    // Calculate savings (vs using Claude Sonnet at $3/M tokens)
    const sonnetCost = (historyData.allTime.totalTokens / 1000000) * 3;
    const savings = sonnetCost - historyData.allTime.totalCost;

    const newUsageData = {
        summary: {
            activeAgents: data.sessions.length,
            currentCost: currentSessionCost,
            currentTokens: currentSessionTokens,
            allTimeCost: historyData.allTime.totalCost,
            allTimeTokens: historyData.allTime.totalTokens,
            savingsVsSonnet: savings,
            lastUpdated: new Date().toISOString()
        },
        models: modelStats,
        today: historyData.daily.find(d => d.date === today) || { cost: 0, tokens: 0 },
        thisMonth: historyData.monthly.find(m => m.month === currentMonth) || { cost: 0, tokens: 0 }
    };

    fs.writeFileSync(USAGE_FILE, JSON.stringify(newUsageData, null, 2));
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyData, null, 2));
    
    console.log('✅ Usage tracked:');
    console.log('   Today: $' + currentSessionCost.toFixed(4) + ' | ' + currentSessionTokens.toLocaleString() + ' tokens');
    console.log('   All-time: $' + historyData.allTime.totalCost.toFixed(4) + ' | ' + historyData.allTime.totalTokens.toLocaleString() + ' tokens');
    console.log('   Savings vs Sonnet: $' + savings.toFixed(2));

} catch (error) {
    console.error('❌ Error updating usage:', error.message);
}