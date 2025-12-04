#!/bin/bash

# Multi-Index Chart Deployment Script
# For Hostinger VPS Ubuntu

echo "🚀 Starting deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Navigate to project directory
cd /var/www/multi-index-chart || exit 1

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed!"
    exit 1
fi

# Set proper permissions
echo "🔒 Setting permissions..."
chown -R www-data:www-data /var/www/multi-index-chart
chmod -R 755 /var/www/multi-index-chart

# Restart the service
echo "♻️ Restarting multi-index-chart service..."
systemctl restart multi-index-chart.service

if [ $? -ne 0 ]; then
    echo "❌ Service restart failed!"
    exit 1
fi

# Wait for service to start
sleep 2

# Check service status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Service Status:"
systemctl status multi-index-chart.service --no-pager --lines=5

# Test if service is responding
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Testing service response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Service is responding correctly (HTTP $HTTP_CODE)"
else
    echo "⚠️ Service might have issues (HTTP $HTTP_CODE)"
fi

# Reload Nginx
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Reloading Nginx..."
systemctl reload nginx

if [ $? -ne 0 ]; then
    echo "❌ Nginx reload failed!"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment Complete!"
echo ""
echo "Access your application at:"
echo "  📊 http://82.25.105.18/charts/"
echo "  📈 http://YOUR_DOMAIN/charts/ (if configured)"
echo ""
echo "Other services:"
echo "  🗺️ Heatmap: http://82.25.105.18/heatmap/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
