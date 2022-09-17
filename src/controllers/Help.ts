export const helpTxt: Record<string, string> = {
	"help":
		"usage: androidjs -h|--help|help",

	"version":
		"usage: androidjs -v|--version|version",

	"init":
		"usage: androidjs init [appdata?]\n" +
		"  appdata          Path to create APK building info file\n" +
		"                   [Default: 'appdata.json']\n" +
		" - Create APK building info file with default values",

	"clearCache":
		"usage: androidjs cc|clear-cache\n" +
		" - Clear cache from previous compilation",

	"clearLogs":
		"usage: androidjs clear-logs\n" +
		" - Clear error.log and info.log. (.../node_modules/androidjs/)",

	"build":
		"usage: androidjs b|build [appdata?]\n" +
		"  appdata          Build APK with building info located in appdata\n" +
		"                   [Default: 'appdata.json']\n" +
		" - Build APK from building info file\n" +
		" + Requires: JAVA",

	"sign":
		"usage: androidjs s|sign\n" +
		" - Instructions to generate custom Keystore file\n" +
		"\n" +
		"usage: androidjs s|sign [apk] [keystore?] [password?]\n" +
		"  apk              Already built APK to be signed\n" +
		"  keystore         Keystore file. [Default: debug.keystore (.../node_modules/androidjs/)]\n" +
		"  password         Keystore Password. [Default: 123456 (debug.keystore password)]\n" +
		" - Sign APK with custom keystore\n" +
		"\n" +
		"usage: androidjs s|sign [apk]\n" +
		" - Sign APK with a debug keystore\n" +
		" + Intended for testing\n" +
		"\n" +
		" ? First time will ask for SDK location\n" +
		" ! Requires: SDK",

};
