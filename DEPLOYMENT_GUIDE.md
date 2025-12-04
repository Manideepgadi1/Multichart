# Deployment Guide - Multi-Index Chart to Hostinger VPS

## 📋 Project Overview
- **Project**: Multi-Index Comparison Chart
- **VPS IP**: 82.25.105.18
- **OS**: Ubuntu
- **Existing**: heatmap-dashboard on port 8000
- **New Project Port**: 8001 (backend) / 3001 (if needed)
- **Frontend**: Static files (HTML/JS/CSS)
- **Backend**: Python HTTP server (for CSV serving)

---

## 🚀 STEP 1: Create GitHub Repository & Push Code

### 1.1 Initialize Git Repository Locally

Open PowerShell in your project directory:

```powershell
cd d:\Multichart

# Initialize git repository
git init

# Create .gitignore
@"
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info/
dist/
build/
.env
.vscode/
*.log
node_modules/
"@ | Out-File -FilePath .gitignore -Encoding UTF8

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Multi-Index Comparison Chart"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `multi-index-chart`
3. Description: `Interactive chart for comparing financial indices with advanced zoom features`
4. Make it **Public** or **Private** (your choice)
5. Don't initialize with README (we already have code)
6. Click "Create repository"

### 1.3 Push to GitHub

```powershell
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/multi-index-chart.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** You'll need to authenticate with GitHub. Use a Personal Access Token (PAT):
- Go to GitHub Settings → Developer settings → Personal access tokens → Generate new token
- Select `repo` scope
- Use the token as your password when pushing

---

## 🖥️ STEP 2: VPS Server Setup

### 2.1 Connect to VPS

```powershell
ssh root@82.25.105.18
```

### 2.2 Create Project Directory

```bash
# Create application directory
mkdir -p /var/www/multi-index-chart
cd /var/www/multi-index-chart

# Clone repository (replace with your GitHub URL)
git clone https://github.com/YOUR_USERNAME/multi-index-chart.git .

# Set proper permissions
chown -R www-data:www-data /var/www/multi-index-chart
chmod -R 755 /var/www/multi-index-chart
```

### 2.3 Install Python Dependencies (if needed)

```bash
# Update system
apt update

# Python should already be installed, verify
python3 --version

# Install pip if not present
apt install python3-pip -y

# No external dependencies needed for this project
# It uses only standard Python libraries
```

---

## 🔧 STEP 3: Create Systemd Service

### 3.1 Create Service File

```bash
nano /etc/systemd/system/multi-index-chart.service
```

Add this configuration:

```ini
[Unit]
Description=Multi-Index Chart HTTP Server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/multi-index-chart
ExecStart=/usr/bin/python3 -m http.server 8001
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### 3.2 Enable and Start Service

```bash
# Reload systemd
systemctl daemon-reload

# Enable service to start on boot
systemctl enable multi-index-chart.service

# Start the service
systemctl start multi-index-chart.service

# Check status
systemctl status multi-index-chart.service

# View logs if needed
journalctl -u multi-index-chart.service -f
```

---

## 🌐 STEP 4: Configure Nginx

### 4.1 Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/multi-index-chart
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name 82.25.105.18;  # or your domain

    # Multi-Index Chart Project
    location /charts/ {
        proxy_pass http://localhost:8001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers for CSV access
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    }

    # Heatmap Dashboard (existing - port 8000)
    location /heatmap/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Root - Optional: Redirect to one of the apps
    location = / {
        return 301 /charts/;
    }
}
```

### 4.2 Enable Configuration

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/multi-index-chart /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## 🔐 STEP 5: Configure Firewall (if needed)

```bash
# Allow ports if UFW is enabled
ufw allow 8001/tcp
ufw reload

# Check status
ufw status
```

---

## 🎯 STEP 6: Access Your Applications

### Option A: Path-based routing (Current Setup)

- **Multi-Index Chart**: http://82.25.105.18/charts/
- **Heatmap Dashboard**: http://82.25.105.18/heatmap/

### Option B: Subdomain routing (If you have a domain)

If you have a domain (e.g., `example.com`), create this configuration:

```bash
nano /etc/nginx/sites-available/multi-projects
```

```nginx
# Multi-Index Chart Subdomain
server {
    listen 80;
    server_name charts.example.com;

    location / {
        proxy_pass http://localhost:8001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Heatmap Dashboard Subdomain
server {
    listen 80;
    server_name heatmap.example.com;

    location / {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then add DNS A records:
- `charts.example.com` → 82.25.105.18
- `heatmap.example.com` → 82.25.105.18

---

## 🔄 STEP 7: Update Deployment Script

Create a deployment script for easy updates:

```bash
nano /var/www/multi-index-chart/deploy.sh
```

```bash
#!/bin/bash

echo "🚀 Deploying Multi-Index Chart..."

# Navigate to project directory
cd /var/www/multi-index-chart

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Set permissions
echo "🔒 Setting permissions..."
chown -R www-data:www-data /var/www/multi-index-chart
chmod -R 755 /var/www/multi-index-chart

# Restart service
echo "♻️ Restarting service..."
systemctl restart multi-index-chart.service

# Check status
echo "✅ Service status:"
systemctl status multi-index-chart.service --no-pager

echo "🎉 Deployment complete!"
echo "Access at: http://82.25.105.18/charts/"
```

Make it executable:

```bash
chmod +x /var/www/multi-index-chart/deploy.sh
```

---

## 📊 STEP 8: Monitoring & Maintenance

### Check Service Status
```bash
systemctl status multi-index-chart.service
```

### View Logs
```bash
# Service logs
journalctl -u multi-index-chart.service -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Restart Service
```bash
systemctl restart multi-index-chart.service
```

### Update Application
```bash
cd /var/www/multi-index-chart
./deploy.sh
```

---

## 🔍 STEP 9: Troubleshooting

### Issue: Service won't start
```bash
# Check logs
journalctl -u multi-index-chart.service -n 50

# Check if port is in use
netstat -tulpn | grep 8001

# Verify permissions
ls -la /var/www/multi-index-chart
```

### Issue: Nginx 502 Bad Gateway
```bash
# Check if backend is running
systemctl status multi-index-chart.service

# Test backend directly
curl http://localhost:8001

# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

### Issue: CSV file not loading
```bash
# Verify file exists
ls -la /var/www/multi-index-chart/Latest_Indices_rawdata_14112025.csv

# Check file permissions
chmod 644 /var/www/multi-index-chart/*.csv

# Test direct access
curl http://localhost:8001/Latest_Indices_rawdata_14112025.csv
```

---

## 🎨 STEP 10: Optional - Add SSL Certificate

If you have a domain, add free SSL with Let's Encrypt:

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificate (replace with your domain)
certbot --nginx -d charts.example.com

# Auto-renewal is set up automatically
# Test renewal
certbot renew --dry-run
```

---

## 📝 Quick Reference Commands

```bash
# Deploy/Update
cd /var/www/multi-index-chart && ./deploy.sh

# Restart services
systemctl restart multi-index-chart.service
systemctl reload nginx

# View logs
journalctl -u multi-index-chart.service -f

# Check status
systemctl status multi-index-chart.service
systemctl status nginx

# Test URLs
curl http://localhost:8001
curl http://82.25.105.18/charts/
```

---

## 🌍 Final Access URLs

### Development (Local)
- http://localhost:8000

### Production (VPS)
- **Path-based**: http://82.25.105.18/charts/
- **Direct port**: http://82.25.105.18:8001 (if firewall allows)
- **With domain**: http://charts.yourdomain.com (after DNS setup)

### Other Projects
- **Heatmap Dashboard**: http://82.25.105.18/heatmap/

---

## 📦 Project Structure on VPS

```
/var/www/multi-index-chart/
├── index.html
├── chart.js
├── Latest_Indices_rawdata_14112025.csv
├── highcharts-zoom-template.html
├── cursor-zoom-only.html
├── prepare_data.py
├── README.md
├── TECHNICAL_DOCUMENTATION.md
└── deploy.sh
```

---

## ✅ Deployment Checklist

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] SSH into VPS
- [ ] Clone repository to `/var/www/multi-index-chart`
- [ ] Create systemd service
- [ ] Start and enable service
- [ ] Configure Nginx
- [ ] Test Nginx configuration
- [ ] Reload Nginx
- [ ] Access application via browser
- [ ] Set up deployment script
- [ ] Configure firewall (if needed)
- [ ] Add SSL certificate (optional)
- [ ] Document access URLs

---

## 🆘 Support

### Service Issues
```bash
systemctl status multi-index-chart.service
journalctl -u multi-index-chart.service -f
```

### Nginx Issues
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### Permission Issues
```bash
chown -R www-data:www-data /var/www/multi-index-chart
chmod -R 755 /var/www/multi-index-chart
```

---

**Deployment Date**: November 25, 2025  
**Version**: 1.0  
**VPS**: Hostinger Ubuntu VPS  
**Maintainer**: Your Name
