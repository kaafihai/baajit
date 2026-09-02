#!/bin/bash

# Baajit v1.1.0 Android APK Build Script
# Run this on your Mac with full development environment

set -e

echo "🚀 Starting Baajit v1.1.0 Android APK Build"
echo "============================================="

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Install with: npm install -g pnpm"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "❌ Rust/Cargo not found. Install from https://rustup.rs"
    exit 1
fi

if ! command -v rustup &> /dev/null; then
    echo "⚠️  rustup not found, but cargo is available"
fi

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "📦 Step 1: Installing dependencies..."
pnpm install

echo ""
echo "🔨 Step 2: Building TypeScript..."
npm run build

echo ""
echo "📱 Step 3: Building Android App Bundle (.aab) for Google Play..."
pnpm tauri android build -- --aab

echo ""
echo "📱 Step 4: Building Android APK for direct install / GitHub release..."
pnpm tauri android build -- --apk

echo ""
echo "✅ Build complete!"
echo ""
echo "Upload THIS file to Google Play Console (not the APK):"
echo "  src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab"
echo ""
echo "APK (for testers, direct download, or F-Droid) is at:"
echo "  src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk"
echo ""
echo "Play's dynamic delivery splits the .aab per device automatically, so the"
echo "real download for a phone user is ~13-15MB even though this build still"
echo "contains all four architectures."
echo ""
echo "Next steps:"
echo "  1. Test APK on Android device"
echo "  2. Sign both (optional for APK, required for AAB upload to Play)"
echo "  3. Upload the .aab to Google Play Console; attach both files to the GitHub release"
