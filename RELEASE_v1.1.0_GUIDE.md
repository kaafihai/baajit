# Baajit v1.1.0 Release Guide

## Overview
All v1.1.0 features have been implemented and TypeScript compilation errors are fixed. This guide will walk you through building the APK and creating the GitHub release.

## Prerequisites
Ensure you have on your Mac:
- Node.js v18+
- pnpm (install with: `npm install -g pnpm`)
- Rust & Cargo (install from https://rustup.rs)
- Android SDK (via Android Studio or command line)
- Xcode (for macOS build - optional but recommended)

## Step 1: Verify Code is Ready

All changes have been committed. Check the current state:

```bash
cd ~/Desktop/shard
git log --oneline -5
```

You should see:
```
fe66d5b Add v1.1.0 APK build instructions
44be6b9 Fix TypeScript compilation errors for v1.1.0
118398a Add Android v1.0.0 APK download link
fdd808f fix build & update android build files
```

## Step 2: Push to GitHub

Push the latest commits to GitHub:

```bash
git push origin main
```

This uploads all v1.1.0 code and build documentation.

## Step 3: Build Android APK

### Option A: Using the build script
```bash
chmod +x BUILD_APK_v1.1.0.sh
./BUILD_APK_v1.1.0.sh
```

### Option B: Manual step-by-step
```bash
# Install dependencies
pnpm install

# Build TypeScript
npm run build

# Build Android APK
pnpm tauri android build
```

### Expected Output
When successful, you'll see:
```
✓ Running build command...
✓ Generated APK at src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk
```

The APK file will be approximately 54-60 MB.

## Step 4: Build macOS DMG (Optional)

If you haven't built the macOS version yet:

```bash
pnpm tauri build
```

The DMG will be at:
```
src-tauri/target/release/bundle/dmg/Baajit_1.1.0_universal.dmg
```

## Step 5: Copy Build Artifacts

```bash
# Create a release directory
mkdir -p ~/Desktop/shard-v1.1.0-release

# Copy APK
cp src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk ~/Desktop/shard-v1.1.0-release/baajit-v1.1.0.apk

# Copy macOS DMG (if built)
cp src-tauri/target/release/bundle/dmg/Baajit_1.1.0_universal.dmg ~/Desktop/shard-v1.1.0-release/baajit-v1.1.0.dmg

# List the files
ls -lh ~/Desktop/shard-v1.1.0-release/
```

## Step 6: Create GitHub Release

Using the GitHub web interface:

1. Go to https://github.com/kaafihai/shard/releases
2. Click "Create a new release"
3. **Tag version**: `v1.1.0`
4. **Release title**: `Baajit v1.1.0 - Energy-Aware & Rabbit Emotions`
5. **Description**:

```markdown
# Baajit v1.1.0

## 🎉 New Features

### Time-of-Day Cues
Set habits for specific times of day:
- 🌅 Morning
- 🌞 Afternoon
- 🌙 Evening
- ⏰ Anytime

### Energy-Aware Smart Suggestions
Baajit learns your energy patterns and suggests habits accordingly:
- Low energy days: Gentle micro-habits
- Medium energy days: Regular habits
- High energy days: Challenge habits

### Gentle Notifications
Opt-in notifications with customizable times to help you remember your habits.

### Rabbit Emotions
Your rabbit companion now has emotions that reflect your activity:
- 😊 Happy - Default cheerful state
- ⚡ Energetic - Completed lots of tasks
- 😴 Tired - Long day with no activity
- 🧘 Calm - Good mood with light activity
- 🎯 Focused - On a roll with tasks
- 😕 Confused - Mixed signals
- 🏆 Proud - High achievement day

## 📥 Downloads

- **Android**: `baajit-v1.1.0.apk` - Download and install on Android 6.0+
- **macOS**: `baajit-v1.1.0.dmg` - Download and install on macOS 10.13+

## 🛠️ Installation

### Android
1. Download the APK
2. Enable "Unknown sources" in Settings → Security
3. Open the APK file to install
4. Launch Baajit from your app drawer

### macOS
1. Download the DMG
2. Open the DMG file
3. Drag Baajit to Applications folder
4. Launch from Applications

## 🐛 Bug Fixes & Improvements
- Fixed TypeScript compilation errors
- Improved database schema for v1.1 features
- Better error handling for missing routes

## 📝 Developer Notes
- Built with Tauri v2, React 19, and TypeScript
- SQLite local-first database
- All data stored locally on device

---

Built with ❤️ for neurodivergent minds by Sharada
```

6. Attach the files:
   - Drag and drop or click "Attach binaries"
   - Upload `baajit-v1.1.0.apk`
   - Upload `baajit-v1.1.0.dmg` (if available)

7. Click "Publish release"

## Step 7: Update README with Download Links

Edit `README.md` and update the download section:

```markdown
## 📥 Downloads

### Latest Version: v1.1.0

**macOS** (Intel & Apple Silicon):
[Download baajit-v1.1.0.dmg](https://github.com/kaafihai/shard/releases/download/v1.1.0/baajit-v1.1.0.dmg)

**Android** (APK):
[Download baajit-v1.1.0.apk](https://github.com/kaafihai/shard/releases/download/v1.1.0/baajit-v1.1.0.apk)

### Requirements
- **macOS**: 10.13 or later
- **Android**: 6.0 (API 23) or later

### Installation Instructions
[See Installation Guide](./docs/INSTALLATION.md)
```

Then commit and push:
```bash
git add README.md
git commit -m "Update download links for v1.1.0"
git push origin main
```

## Step 8: Verify Release

1. Visit https://github.com/kaafihai/shard/releases/tag/v1.1.0
2. Verify both APK and DMG are downloadable
3. Download and test the APK on an Android device:
   - App launches
   - Energy suggestions appear based on mood
   - Time-of-day dropdown works in habit creation
   - Rabbit emotions update based on activity
   - Notifications can be configured

## Troubleshooting

### APK Build Fails
```bash
# Clear cargo cache and rebuild
cargo clean
pnpm tauri android build
```

### Network Issues During Build
```bash
# Try with offline mode or use alternate registry
npm config set registry https://registry.npmjs.org/
pnpm install --no-lockfile
```

### Android SDK Issues
Ensure `ANDROID_HOME` is set:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Verification on Device
After installing APK on Android phone:
```bash
# View app logs
adb logcat | grep -i baajit

# Clear app cache if needed
adb shell pm clear com.shard.baajit
```

## Support

For issues or questions about the build process:
1. Check the [Tauri documentation](https://tauri.app)
2. Review the [BUILD_APK_v1.1.0.sh](./BUILD_APK_v1.1.0.sh) script
3. Check commit history for changes made

---

**Version**: v1.1.0
**Build Date**: 2026-03-29
**Status**: Ready for release
**All Tests**: Passing

Built with care for neurodivergent productivity 🐰
