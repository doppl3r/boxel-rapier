# Boxel Rapier

## Local Development

- Install NodeJS package libraries: `npm install`
- Run development libraries `npm run dev`
- Use the link it provides

## Update NPM libraries

- Run `npm outdated`
- Run `npm i package-name@latest` (for Rapier.js, replace `latest` with `canary`)

## Build for release

- Run `npm run dist-extension` to create zipped files
- Upload to Chrome Webstore

## Test Chrome Extension

- Rebuild extension and open Google Chrome
- Click Extensions > Manage Extensions
- Enable Developer mode (top right)
- Click `Load unpacked` and navigate to the `/build` folder
- Open extension within Chrome

## Build on Android/iOS

- Increment `versionCode` and `versionName` in `/android/app/build.gradle`
- Run build & sync with `npm run dist-android`
- Open Android Studio: `npx cap open android`
- Select Build > Generate Signed App Bundle or APK...

## Update App Icon/Splash

- Update the assets within the `/files/png/assets` directory
- Run asset plugin with `npm run generate-assets`