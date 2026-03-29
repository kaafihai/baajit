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
echo "📱 Step 3: Building Android APK..."
pnpm tauri android build

echo ""
echo "✅ Build complete!"
echo ""
echo "APK Location:"
echo "  src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk"
echo ""
echo "Next steps:"
echo "  1. Test APK on Android device"
echo "  2. Sign APK (optional but recommended)"
echo "  3. Upload to GitHub release v1.1.0"
