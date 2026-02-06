const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    // Get session list in JSON format
    const output = execSync('openclaw sessions list --json', { encoding: 'utf-8' });
    const data = JSON.parse(output);

    // Find the main session (usually the active one or most recent)
    const mainSession = data.sessions.find(s => s.key === 'agent:main:main') || data.sessions[0];

    if (mainSession) {
        const usageData = {
            model: mainSession.model,
            totalTokens: mainSession.totalTokens || 0,
            cost: mainSession.usage?.cost?.total || 0, // Extract cost if available in usage object
            contextTokens: mainSession.contextTokens || 0,
            lastUpdated: new Date().toISOString()
        };

        // If cost is missing from session list, we might need to estimate or it might be 0 for local models
        // For now, let's trust the CLI output structure.

        fs.writeFileSync(
            path.join(__dirname, '../dashboard/usage.json'), 
            JSON.stringify(usageData, null, 2)
        );
        console.log('Usage data updated:', usageData);
    } else {
        console.error('No active session found.');
    }
} catch (error) {
    console.error('Error updating usage data:', error);
}
