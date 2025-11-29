# PowerShell script to add high-value design assets to CMO Simulator

Write-Host "🎨 Adding Premium Design Assets to CMO Simulator" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Adding shadcn/ui premium components..." -ForegroundColor Yellow
Write-Host ""

# Celebration & Animation Components
Write-Host "✨ Adding celebration animations..." -ForegroundColor Green
npx shadcn@latest add meteors --yes
npx shadcn@latest add sparkles --yes
npx shadcn@latest add shooting-stars --yes

# Background Effects
Write-Host "🎨 Adding background effects..." -ForegroundColor Green
npx shadcn@latest add background-beams --yes
npx shadcn@latest add aurora-background --yes

# Text Effects
Write-Host "📝 Adding text effects..." -ForegroundColor Green
npx shadcn@latest add gradient-text --yes
npx shadcn@latest add shimmering-text --yes

Write-Host ""
Write-Host "📦 Step 2: Installing animation libraries..." -ForegroundColor Yellow
Write-Host ""

# Install Lottie for complex animations
npm install lottie-react

# Install React CountUp for animated numbers
npm install react-countup

# Install React Hot Toast for better notifications
npm install react-hot-toast

Write-Host ""
Write-Host "✅ Design assets installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Browse available components: Ask me to 'list shadcn components'"
Write-Host "2. Get component code: Ask me to 'get [component-name] from shadcn'"
Write-Host "3. Download Lottie animations from: https://lottiefiles.com/free-animations"
Write-Host ""
Write-Host "🎯 Recommended components to explore:" -ForegroundColor Yellow
Write-Host "   - animated-beam (connect dashboard elements)"
Write-Host "   - area-chart-01 (enhanced analytics)"
Write-Host "   - bar-chart-01 (better charts)"
Write-Host "   - particles (engagement effects)"
Write-Host ""

