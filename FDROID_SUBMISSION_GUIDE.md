# F-Droid Submission Guide for Baajit

This guide will walk you through submitting Baajit to F-Droid using GitHub's web interface (no git clone needed).

## Step 1: Go to Your Fork

Go to: `https://github.com/sharadarao/fdroiddata`

## Step 2: Create the Directory Structure

Click **Add file** → **Create new file**

Create these files in order:

### File 1: `metadata/com.kaafihai.baajit.yml`

Click the folder icon and type the path above, then paste this content:

```yaml
Categories:
  - Office
  - Health & Fitness
License: MIT
AuthorName: Sharada Rao
AuthorEmail: sharadarao0@gmail.com
WebSite: https://github.com/kaafihai/shard
SourceCode: https://github.com/kaafihai/shard
IssueTracker: https://github.com/kaafihai/shard/issues
Changelog: https://github.com/kaafihai/shard/releases

Name: Baajit
Summary: Task & habit management for neurodivergent minds

Description: |-
  Baajit is a task and habit management app designed from the ground up for neurodivergent minds—specifically ADHD and autistic brains. Built with the belief that productivity tools should work *with* your brain, not against it.

  Most apps assume neurotypical brains: linear thinking, sustained focus, and willpower-based motivation. Baajit is different. Every feature addresses a real neurodivergent challenge: executive dysfunction, sensory overwhelm, time blindness, rejection sensitivity, and the constant battle between knowing what to do and being able to do it.

  Features include energy-aware task suggestions (because capacity matters), brain dump capture for racing thoughts, task breakdown for overwhelming projects, sensory grounding exercises for focus and overwhelm, a rabbit companion that grows with your progress, habit streak tracking, mood logging, and a focus timer. Everything stays on your device—always private, always yours.

RepoType: git
Repo: https://github.com/kaafihai/shard.git

Builds:
  - versionName: '1.0.0'
    versionCode: 1
    commit: v1.0.0
    subdir: .
    gradle:
      - yes

CurrentVersion: '1.0.0'
CurrentVersionCode: 1
```

## Step 3: Upload Screenshots

For each screenshot (1.png through 5.png):

1. Click **Add file** → **Upload files**
2. Create the path: `metadata/com.kaafihai.baajit/en-US/images/phoneScreenshots/`
3. Upload your screenshots as:
   - 1.png (Welcome screen)
   - 2.png (Feature flowchart)
   - 3.png (Mood check-in)
   - 4.png (Energy check-in)
   - 5.png (Tasks dashboard or Brain dump)

## Step 4: Create Pull Request

Once all files are added:

1. Go to your fork main branch
2. Click **Contribute** → **Open pull request**
3. Write a title: "Add Baajit: Task management app for neurodivergent minds"
4. Add description:
   ```
   This adds Baajit v1.0.0 to F-Droid.

   Baajit is a free, open-source task and habit management app designed specifically for neurodivergent minds (ADHD and autism).

   - Local-first, all data stays on device
   - MIT License
   - Built with Tauri, React, TypeScript, SQLite
   - Available for macOS and Android
   ```
5. Click **Create pull request**

## What Happens Next

- F-Droid maintainers will review your submission (1-4 weeks)
- They'll build the app from source
- If all checks pass, Baajit appears in F-Droid! 🐰

---

**Questions?** Refer to F-Droid's official guide: https://f-droid.org/docs/All_About_Metadata_Files/
