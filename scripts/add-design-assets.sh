#!/bin/bash
# Quick script to add high-value design assets to CMO Simulator

echo "🎨 Adding Premium Design Assets to CMO Simulator"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this from the project root."
  exit 1
fi

echo "📦 Step 1: Adding shadcn/ui premium components..."
echo ""

# Celebration & Animation Components
echo "✨ Adding celebration animations..."
npx shadcn@latest add meteors --yes
npx shadcn@latest add sparkles --yes
npx shadcn@latest add shooting-stars --yes

# Background Effects
echo "🎨 Adding background effects..."
npx shadcn@latest add background-beams --yes
npx shadcn@latest add aurora-background --yes

# Text Effects
echo "📝 Adding text effects..."
npx shadcn@latest add gradient-text --yes
npx shadcn@latest add shimmering-text --yes

echo ""
echo "📦 Step 2: Installing animation libraries..."
echo ""

# Install Lottie for complex animations
npm install lottie-react

# Install React CountUp for animated numbers
npm install react-countup

# Install React Hot Toast for better notifications
npm install react-hot-toast

echo ""
echo "✅ Design assets installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Browse available components: Ask me to 'list shadcn components'"
echo "2. Get component code: Ask me to 'get [component-name] from shadcn'"
echo "3. Download Lottie animations from: https://lottiefiles.com/free-animations"
echo ""
echo "🎯 Recommended components to explore:"
echo "   - animated-beam (connect dashboard elements)"
echo "   - area-chart-01 (enhanced analytics)"
echo "   - bar-chart-01 (better charts)"
echo "   - particles (engagement effects)"
echo ""

