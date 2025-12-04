# Git Setup Script for Windows PowerShell

Write-Host "🚀 Setting up Git repository for Multi-Index Chart" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$projectPath = "d:\Multichart"
Set-Location $projectPath

Write-Host "`n📁 Current directory: $projectPath" -ForegroundColor Green

# Initialize git if not already initialized
if (!(Test-Path ".git")) {
    Write-Host "`n📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "`n✅ Git repository already initialized" -ForegroundColor Green
}

# Add all files
Write-Host "`n📝 Adding files to Git..." -ForegroundColor Yellow
git add .

# Check status
Write-Host "`n📊 Git Status:" -ForegroundColor Yellow
git status --short

# Create initial commit if no commits exist
$commitCount = git rev-list --all --count 2>$null
if ($commitCount -eq 0) {
    Write-Host "`n💾 Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: Multi-Index Comparison Chart

Features:
- Compare up to 4 indices
- Advanced zoom capabilities (mouse wheel, navigator, buttons)
- Dark mode support
- 127+ Indian market indices
- Percentage-based comparison from 0% baseline
- Interactive tooltips with price and percentage
- Category organization (Broad, Sectoral, Strategy, Thematic)
- Highcharts Stock integration"
    
    Write-Host "✅ Initial commit created" -ForegroundColor Green
} else {
    Write-Host "`n✅ Repository already has commits" -ForegroundColor Green
}

# Instructions for GitHub
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📖 Next Steps:" -ForegroundColor Cyan
Write-Host "`n1️⃣  Create GitHub Repository:" -ForegroundColor Yellow
Write-Host "   • Go to: https://github.com/new" -ForegroundColor White
Write-Host "   • Repository name: multi-index-chart" -ForegroundColor White
Write-Host "   • Description: Interactive chart for comparing financial indices" -ForegroundColor White
Write-Host "   • Make it Public or Private (your choice)" -ForegroundColor White
Write-Host "   • DON'T initialize with README (we already have code)" -ForegroundColor White
Write-Host "   • Click 'Create repository'" -ForegroundColor White

Write-Host "`n2️⃣  Get Personal Access Token (if not already):" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   - Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "   - Select 'repo' scope" -ForegroundColor White
Write-Host "   - Copy the token (you will need it as password)" -ForegroundColor White

Write-Host "`n3️⃣  Push to GitHub:" -ForegroundColor Yellow
Write-Host "   Run these commands (replace YOUR_USERNAME):" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/multi-index-chart.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "   When prompted, use your GitHub username and token as password" -ForegroundColor White

Write-Host "`n4️⃣  After pushing, deploy to VPS:" -ForegroundColor Yellow
Write-Host "   See DEPLOYMENT_GUIDE.md for complete instructions" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Git setup complete! Follow the steps above." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
