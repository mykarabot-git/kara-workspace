const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    const output = execSync('openclaw sessions list --json', { encoding: 'utf-8' });
    const data = JSON.parse(output);

    const modelStats = {};
    let totalSystemCost = 0;

    // Approximate costs per 1M tokens (Input/Output blended for simplicity)
    const RATES = {
        'claude-opus': 15.00,
        'claude-sonnet': 3.00,
        'gpt-5': 10.00,
        'gemini': 0.50, // very cheap
        'glm': 0.00,    // local/free
        'grok': 2.00
    };

    data.sessions.forEach(session => {
        const modelName = session.model || 'Unknown';
        
        if (!modelStats[modelName]) {
            modelStats[modelName] = {
                activeSessions: 0,
                totalTokens: 0,
                cost: 0
            };
        }

        modelStats[modelName].activeSessions += 1;
        modelStats[modelName].totalTokens += (session.totalTokens || 0);

        // Estimate cost
        let rate = 1.0; // default $1/1M
        for (const [key, val] of Object.entries(RATES)) {
            if (modelName.toLowerCase().includes(key)) rate = val;
        }
        
        const sessionCost = ((session.totalTokens || 0) / 1000000) * rate;
        modelStats[modelName].cost += sessionCost;
        totalSystemCost += sessionCost;
    });

    const usageData = {
        summary: {
            activeAgents: data.sessions.length,
            totalCost: totalSystemCost,
            lastUpdated: new Date().toISOString()
        },
        models: modelStats
    };

    fs.writeFileSync(
        path.join(__dirname, '../dashboard/usage.json'), 
        JSON.stringify(usageData, null, 2)
    );
    console.log('Usage data updated:', usageData);

} catch (error) {
    console.error('Error updating usage data:', error);
}
