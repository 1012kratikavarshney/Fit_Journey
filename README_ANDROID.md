# FitJourney Android App

This directory contains the native Android Studio project files to run FitJourney as an Android app.

## How to run

1. **Build the Web App**:
   You need to transpile the React/TypeScript code into standard HTML/JS.
   Run your build command (e.g., `npm run build` or `yarn build`).

2. **Copy Assets**:
   Create a folder `android/app/src/main/assets`.
   Copy the *contents* of your build output folder (e.g., `dist/` or `build/`) into `android/app/src/main/assets`.
   
   Ensure `index.html` is at `android/app/src/main/assets/index.html`.

3. **Open in Android Studio**:
   - Open Android Studio.
   - Select "Open".
   - Navigate to and select the `android` folder in this project.
   - Allow Gradle to sync (this downloads dependencies).

4. **Run**:
   - Create a Virtual Device (Emulator) or connect a physical Android phone.
   - Click the green "Run" (Play) button.

## Development Note
In `MainActivity.kt`, the app is configured to load `file:///android_asset/index.html`. 
If you want to test with a live development server (hot reloading), change that line to your computer's local IP address, e.g., `webView.loadUrl("http://10.0.2.2:3000")`.
