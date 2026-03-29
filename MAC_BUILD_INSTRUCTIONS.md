# Building Baajit v1.1.0 on Your Mac

## Important

The code and guides have been prepared in Claude. Now you need to build on your **actual Mac Terminal** (not in Claude's Linux VM).

## Your Mac Build Steps

Open **Terminal.app** on your Mac and run:

```bash
# Navigate to your shard project
cd ~/Desktop/shard

# Pull latest changes if needed
git pull origin main

# Install dependencies
pnpm install

# Build TypeScript
npm run build

# Build Android APK (this will take several minutes)
pnpm tauri android build
```

## What This Does

1. **pnpm install** - Installs all Node.js dependencies
2. **npm run build** - Compiles TypeScript and builds the web app
3. **pnpm tauri android build** - Compiles Rust backend and builds Android APK

## Expected Success Output

When successful, you'll see:
```
✓ Running build command...
✓ Compiling [dependencies...]
✓ Built app
✓ Generated APK at src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk
```

The APK file will be approximately 54-60 MB.

## After Successful Build

Once the APK is built on your Mac:

```bash
# Rename for clarity
cp src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk baajit-v1.1.0.apk

# Push to GitHub
git push origin main

# Then create the release on GitHub.com
# See RELEASE_v1.1.0_GUIDE.md for detailed release steps
```

## Troubleshooting

### "pnpm: command not found"
Install pnpm:
```bash
npm install -g pnpm
```

### "cargo: command not found"
Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### "Android SDK not found"
Ensure Android Studio is installed and:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Build takes too long
This is normal - first build can take 10-20 minutes. Subsequent builds are faster.

---

**Key Point**: These commands must run on your Mac, not in this Linux VM.
