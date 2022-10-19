This command line interface enables you to build very fast and lightweight Android Applications from your JS/TS Frontend.


## Usage

```sh
npm install -g androidjs
```

After installing it, run `androidjs --help` to see list of options:

```console
AndroidJS: Build frontend into Android APK

usage: androidjs -h|--help|help

usage: androidjs -v|--version|version

usage: androidjs init [appdata?]
  appdata          Path to create APK building info file
                   [Default: 'appdata.json']
 - Create APK building info file with default values

usage: androidjs cc|clear-cache
 - Clear cache from previous compilation

usage: androidjs clear-logs
 - Clear error.log and info.log. (.../node_modules/androidjs/)

usage: androidjs b|build [appdata?]
  appdata          Build APK with building info located in appdata
                   [Default: 'appdata.json']
 - Build APK from building info file
 + Requires: JAVA

usage: androidjs s|sign
 - Instructions to generate custom Keystore file

usage: androidjs s|sign [apk] [keystore?] [password?]
  apk              Already built APK to be signed
  keystore         Keystore file. [Default: debug.keystore (.../node_modules/androidjs/)]
  password         Keystore Password. [Default: 123456 (debug.keystore password)]
 - Sign APK with custom keystore

usage: androidjs s|sign [apk]
 - Sign APK with a debug keystore
 + Intended for testing

 ? First time will ask for SDK location
 ! Requires: SDK

Type a command followed by 'help' to get specific information.
Ex.:  androidjs init help


  Examples:

  – Create appdata.json in cwd
    $ androidjs init
  – Build APK (apk cannot be installed without signing)
    $ androidjs b appdata.json
  – Sign APK for testing/debugging
    $ androidjs s my-app.apk
  – Sign APK for release
    $ androidjs s my-apk release-keystore.jks passwd
  – Get specific help for clear-cache
    $ androidjs cc help
  – Clear cache
    $ androidjs cc
```


### How does it work
AndroidJS has a prebuilt APK (base.apk) ready to be decompiled,  with an empty HTML and a JSInterface (for native purposes).

Build process:
- Decompile base.apk
- Copy project *(HTML, JS, ...)* to base.apk
- Change data of base.apk *(package, icon, color, version, etc)*
- Rebuild base.apk and move it to output.apk


### Cache?
Since the decompilation process is very long, it is being saved (cached) for not decompile again.

If there is some issue with the cached base.apk you can type `androidjs clear-cache` or `androidjs cc` to remove this saved instance of invalid base apk.


### Appdata.json
This file describes how AndroidJS will build your application.
```json
{
	"include": "src",
	"output": "release/my-app.apk",
	"appinfo": {
		"package": "com.example.helloworld",
		"appname": "Hello World",
		"color": "#FF0000",
		"versionCode": 1,
		"versionName": "1.0",
		"icon": "res/icon.png"
	}
}
```
When building this appdata.json, AndroidJS will include everything from `src/` into base.apk and build it to `release/my-app.apk`

**Important** base.apk entry point is **index.html**, so there must be inside `src/` a file named `index.html`

### JSInterface
AndroidJS come along with a prebuilt interface to perform native Android functions *(show a toast, message, notification, etc)*

This example shows how to make a toast:
```javascript
Android.showToast("Hello World", Android.TOAST_SHORT);
```

See all in
[@types/androidjs](https://www.npmjs.com/package/@types/androidjs)

---

# Build Source

### Build Android Studio project
1. Build APK for Release using `/android-studio/app/release.jks` for signing
```sh
./gradlew clean
./gradlew :app:assembleRelease
```

2. Copy the built apk to `/assets/base.apk`
```sh
cp -fv android-studio/app/build/outputs/apk/release/app-release-unsigned.apk assets/base.apk
```

3. Build the typescript source
```sh
npm run build
```
(use `tsc` if you dont want to copy the assets to `dist/`)

![appicon](appicon.webp)
