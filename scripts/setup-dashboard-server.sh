#!/bin/bash
# Setup KARA Dashboard Server as systemd service

set -e

echo "🔧 Setting up KARA Dashboard API Server..."

# Check if running as root for system setup
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Note: Run with sudo to install systemd service"
    echo "Starting server manually instead..."
    cd /home/kara/.openclaw/workspace/dashboard
    exec node server.js
fi

# Copy service file
cp /home/kara/.openclaw/workspace/dashboard/kara-dashboard.service /etc/systemd/system/

# Reload systemd
systemctl daemon-reload

# Enable and start service
systemctl enable kara-dashboard.service
systemctl start kara-dashboard.service

echo "✅ KARA Dashboard service installed!"
echo "   Status: systemctl status kara-dashboard"
echo "   Logs: journalctl -u kara-dashboard -f"
echo ""
echo "🚀 Dashboard API available at http://localhost:3456"
