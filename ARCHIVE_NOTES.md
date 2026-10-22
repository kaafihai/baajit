# Archive: IzzyOnDroid / F-Droid listing files

This branch (`archive/izzyondroid`) is a frozen copy of `main` taken on 22 October 2026, just before the store-listing files below were retired from `main`.

Nothing in this branch is built or released. It exists only so these files are not lost.

## Why they were retired

Baajit was submitted to IzzyOnDroid (inclusion request #742 on Codeberg). The request was declined, so these listing files are no longer in use on `main`.

## What is kept here

- `fastlane/metadata/android/en-US/` (15 files): store title, short and full description, changelogs for versions 1001009 and 1001010, app icon, and 9 phone screenshots
- `FDROID_SUBMISSION_GUIDE.md`: step-by-step guide for submitting to official F-Droid
- `fdroid-metadata.yml`: draft F-Droid build metadata

The `fastlane` folder follows the standard layout that both IzzyOnDroid and official F-Droid read, so it can be reused if Baajit is submitted to F-Droid later.

## How to bring them back

Copy the files from this branch into `main`, for example:

```
git checkout main
git checkout archive/izzyondroid -- fastlane FDROID_SUBMISSION_GUIDE.md fdroid-metadata.yml
git commit -m "Restore F-Droid listing files from archive"
```

Note: the changelogs and screenshots reflect version 1.1.10. Update them before any new submission.

## Current home of Baajit

- Google Play (closed testing): `com.kaafihai.baajit`
- GitHub releases (Android APK/AAB and macOS DMG): https://github.com/kaafihai/baajit/releases
