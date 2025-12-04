# 🚀 Deployment Quick Start Guide

## ✅ Step 1: Push to GitHub (DO THIS NOW)

### 1. Create GitHub Repository
1. Go to: https://github.com/new
2. Repository name: `multi-index-chart`
3. Description: `Interactive chart for comparing financial indices with advanced zoom`
4. **Public** or **Private** (your choice)
5. **DON'T** check any boxes (no README, no .gitignore)
6. Click **"Create repository"**

### 2. Get Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `multi-index-chart-deploy`
4. Select scope: **`repo`** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** - you won't see it again!

### 3. Push Code to GitHub

```powershell
# In PowerShell (you're already in d:\Multichart)

# Add remote (REPLACE YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/multi-index-chart.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**When prompted:**
- Username: `your_github_username`
- Password: `paste_your_token_here`

---

## 🖥️ Step 2: Deploy to VPS

### 1. Connect to VPS

```bash
ssh root@82.25.105.18
```

### 2. Clone Repository

```bash
# Create directory
mkdir -p /var/www/multi-index-chart
cd /var/www/multi-index-chart

# Clone (REPLACE YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/multi-index-chart.git .

# Set permissions
chown -R www-data:www-data /var/www/multi-index-chart
chmod -R 755 /var/www/multi-index-chart
```

### 3. Create Systemd Service

```bash
nano /etc/systemd/system/multi-index-chart.service
```

Paste this:

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

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### 4. Start Service

```bash
systemctl daemon-reload
systemctl enable multi-index-chart.service
systemctl start multi-index-chart.service
systemctl status multi-index-chart.service
```

### 5. Configure Nginx

```bash
nano /etc/nginx/sites-available/multi-index-chart
```

Paste this:

```nginx
server {
    listen 80;
    server_name 82.25.105.18;

    # Multi-Index Chart
    location /charts/ {
        proxy_pass http://localhost:8001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # CORS for CSV
        add_header Access-Control-Allow-Origin *;
    }

    # Heatmap (existing)
    location /heatmap/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Root redirect
    location = / {
        return 301 /charts/;
    }
}
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### 6. Enable Nginx Config

```bash
# Create symlink
ln -s /etc/nginx/sites-available/multi-index-chart /etc/nginx/sites-enabled/

# Test config
nginx -t

# Reload Nginx
systemctl reload nginx
```

### 7. Make Deploy Script Executable

```bash
chmod +x /var/www/multi-index-chart/deploy.sh
```

---

## 🎯 Step 3: Access Your Application

### Your URLs:
- **Multi-Index Chart**: http://82.25.105.18/charts/
- **Heatmap Dashboard**: http://82.25.105.18/heatmap/

---

## 🔄 Step 4: Future Updates

### To Update Application:

On VPS, run:
```bash
/var/www/multi-index-chart/deploy.sh
```

Or manually:
```bash
cd /var/www/multi-index-chart
git pull origin main
systemctl restart multi-index-chart.service
systemctl reload nginx
```

---

## 🔍 Troubleshooting

### Check Service Status
```bash
systemctl status multi-index-chart.service
```

### View Logs
```bash
journalctl -u multi-index-chart.service -f
```

### Test Backend Directly
```bash
curl http://localhost:8001
```

### Check Nginx Logs
```bash
tail -f /var/log/nginx/error.log
```

### Restart Everything
```bash
systemctl restart multi-index-chart.service
systemctl reload nginx
```

---

## 📞 Quick Commands Reference

```bash
# Service Management
systemctl status multi-index-chart.service
systemctl restart multi-index-chart.service
systemctl stop multi-index-chart.service
systemctl start multi-index-chart.service

# Nginx Management
nginx -t                              # Test config
systemctl reload nginx                 # Reload without downtime
systemctl restart nginx                # Full restart

# Logs
journalctl -u multi-index-chart.service -f
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Deploy Updates
/var/www/multi-index-chart/deploy.sh

# Check Ports
netstat -tulpn | grep 8001
netstat -tulpn | grep 8000
```

---

## ✅ Verification Checklist

- [ ] Git repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Connected to VPS
- [ ] Repository cloned to `/var/www/multi-index-chart`
- [ ] Systemd service created
- [ ] Service started and enabled
- [ ] Nginx configuration created
- [ ] Nginx configuration enabled
- [ ] Nginx reloaded successfully
- [ ] Application accessible at http://82.25.105.18/charts/
- [ ] Heatmap still accessible at http://82.25.105.18/heatmap/
- [ ] Deploy script is executable

---

## 🎉 Success!

If all steps completed:
1. Visit: http://82.25.105.18/charts/
2. Select indices from dropdowns
3. Test zoom features
4. Toggle dark mode

**Both projects should now be running:**
- 📊 Multi-Index Chart on `/charts/` (port 8001)
- 🗺️ Heatmap Dashboard on `/heatmap/` (port 8000)

---

## 📚 Full Documentation

- **DEPLOYMENT_GUIDE.md** - Complete deployment details
- **TECHNICAL_DOCUMENTATION.md** - Technical specifications
- **README.md** - Project overview

---

**Last Updated**: November 25, 2025  
**VPS IP**: 82.25.105.18  
**Ports**: 8000 (heatmap), 8001 (charts)
