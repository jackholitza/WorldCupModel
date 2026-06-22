# WCLIVE iPhone App

This is a small native iOS shell for the deployed World Cup Live app. The URL is hard-coded in `WCLiveApp/ContentView.swift`:

```swift
https://jackholitza.github.io/WorldCupModel/?source=ios
```

## Install On Your iPhone

1. Open `ios/WCLiveApp/WCLiveApp.xcodeproj` in Xcode.
2. Plug in your iPhone with USB, or enable wireless debugging in Xcode.
3. In Xcode, select the `WCLiveApp` target.
4. Go to **Signing & Capabilities** and choose your Apple ID team.
5. If Xcode complains about the bundle ID, change `com.jackholitza.wclive` to something unique like `com.jackholitza.wclive2026`.
6. Select your iPhone in the device picker at the top.
7. Press **Run**.
8. If the phone blocks the app, open iPhone **Settings > General > VPN & Device Management**, trust your developer profile, then launch WCLIVE again.

With a free Apple ID, the sideloaded app usually expires after 7 days. With a paid Apple Developer account, it lasts longer and can be distributed through TestFlight/App Store later.
