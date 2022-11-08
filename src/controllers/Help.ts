export const helpTxt: Record<string, string> = {
	"help":
		"usage: apkjs -h|--help|help",

	"version":
		"usage: apkjs -v|--version|version",

	"init":
		"usage: apkjs init [appdata?]\n" +
		"  appdata          Path to create APK building info file\n" +
		"                   [Default: 'appdata.json']\n" +
		" - Create APK building info file with default values",

	"clearCache":
		"usage: apkjs cc|clear-cache\n" +
		" - Clear cache from previous compilation",

	"clearLogs":
		"usage: apkjs clear-logs\n" +
		" - Clear error.log and info.log. (.../node_modules/apkjs/)",

	"build":
		"usage: apkjs b|build [appdata?]\n" +
		"  appdata          Build APK with building info located in appdata\n" +
		"                   [Default: 'appdata.json']\n" +
		" - Build APK from building info file\n" +
		" + Requires: JAVA",

	"sign":
		"usage: apkjs s|sign\n" +
		" - Instructions to generate custom Keystore file\n" +
		"\n" +
		"usage: apkjs s|sign [apk] [keystore?] [password?]\n" +
		"  apk              Already built APK to be signed\n" +
		"  keystore         Keystore file. [Default: debug.keystore (.../node_modules/apkjs/)]\n" +
		"  password         Keystore Password. [Default: 123456 (debug.keystore password)]\n" +
		" - Sign APK with custom keystore\n" +
		"\n" +
		"usage: apkjs s|sign [apk]\n" +
		" - Sign APK with a debug keystore\n" +
		" + Intended for testing\n" +
		"\n" +
		" ? First time will ask for SDK location\n" +
		" ! Requires: SDK",

};
