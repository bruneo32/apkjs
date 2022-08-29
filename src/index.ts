import fs from "fs";
import { platform } from "os";
import { sep } from "path";
import { load as JSY_Load, dump as JSY_Dump } from "js-yaml";
import promptSync from "prompt-sync";
const prompt = promptSync();

import { com } from "./cmd";
import { Appdata, AppYml, errorAppdata } from "./controllers/Appdata";
import { exec } from "./exec";
import { closeLog, logPath } from "./controllers/Logger";
import { Config, loadConfig, saveConfig } from "./controllers/Config";
import { helpTxt } from "./controllers/Help";
import { js2xml, xml2js } from "xml-js";


export const Global = {
	VERSION: 0.1,
	isWin: false,
	config: <Partial<Config>>{}
};

export async function main(argv2: string[]) {
	const cachePath = __dirname + sep + "__apk__";

	Global.config = loadConfig();
	Global.isWin = platform().toLowerCase().includes("win");

	switch (argv2[0]) {
		case "-h":
		case "--help":
		case "help": {
			console.log("AndroidJS: Build frontend into Android APK\n");

			for (const k of Object.keys(helpTxt)) {
				console.log(helpTxt[k] + "\n");
			}

			console.log("Type a command followed by 'help' to get specific information.");
			console.log("Ex.:  androidjs init help");
		} break;

		case "-v":
		case "--version":
		case "version": {
			console.log(Global.VERSION.toFixed(1));
		} break;

		case "init": {
			if (argv2[1] && argv2[1] == "help") {
				console.log(helpTxt["init"]);
				break;
			}

			const appdataPath = argv2[1] ?? "appdata.json";

			const defaultAppdata: Appdata = {
				include: "dist",
				output: "output.apk",
				appinfo: {
					package: "com.company.example",
					appname: "example",
					color: "#0066FF",
					versionCode: 1,
					versionName: "1.0",
					icons: null
				}
			};

			if (fs.existsSync(appdataPath)) {
				throw "Already exists '" + appdataPath + "'";
			}

			fs.writeFile(appdataPath, JSON.stringify(defaultAppdata, null, 2), {
				encoding: "utf-8",
				flag: "w"
			}, (err) => {
				if (err) { throw err; }
			});

		} break;

		case "cc":
		case "clear-cache": {
			if (argv2[1] && argv2[1] == "help") {
				console.log(helpTxt["clearCache"]);
				break;
			}

			if (!fs.existsSync(cachePath)) {
				console.log("Cache is already clear");
				break;
			}

			fs.rm(cachePath, {
				recursive: true,
				force: true,
			}, (err) => {
				if (err) { throw err; }
				console.log("Cache clear successful");
			});

		} break;

		case "clear-logs": {
			if (argv2[1] && argv2[1] == "help") {
				console.log(helpTxt["clearLogs"]);
				break;
			}

			if (!fs.existsSync(logPath.info) && !fs.existsSync(logPath.error)) {
				console.log("Logs are already clear");
				break;
			}

			fs.rm(logPath.info, {
				force: true,
			}, (err) => {
				if (err) { throw err; }
			});

			fs.rm(logPath.error, {
				force: true,
			}, (err) => {
				if (err) { throw err; }
			});
		} break;

		case "b":
		case "build": {
			if (argv2[1] && argv2[1] == "help") {
				console.log(helpTxt["build"]);
				break;
			}

			const appdataPath = argv2[1] ?? "appdata.json";
			let appdata: Appdata | null = null;

			if (!fs.existsSync(appdataPath) || !fs.lstatSync(appdataPath).isFile()) {
				throw "Not such file '" + appdataPath + "'";
			}

			const data = fs.readFileSync(appdataPath, {
				encoding: "utf-8",
				flag: "r"
			});

			appdata = <Appdata>JSON.parse(data);

			// Check basis
			const errAppdata = errorAppdata(appdata);
			if (errAppdata) { throw errAppdata; }

			// Decompile base.apk
			// If already decompiled, do not decompile again
			if (!fs.existsSync(cachePath)) {
				console.log("Decoding... (once, this will be cached)");
				closeLog("$> " + com["apktool_d"]);
				await exec(com["apktool_d"]);
			} else {
				console.log("WARN! Already decoded cache. If unexpected problems, try 'androidjs clear-cache'");
				fs.rmSync(cachePath + sep + "assets" + sep + "*", {
					recursive: true,
					force: true
				});
			}


			// Modify APK
			console.log("Creating app...");

			// yml
			const ymlPath = cachePath + sep + "apktool.yml";

			const ymlData: AppYml = <AppYml>JSY_Load(fs.readFileSync(ymlPath, {
				encoding: "utf-8",
				flag: "r"
			})?.replace("!!brut.androlib.meta.MetaInfo", ""));

			if (!ymlData) { throw "Error reading apktool.yml"; }

			ymlData.packageInfo.renameManifestPackage = appdata?.appinfo?.package;
			ymlData.versionInfo.versionCode = appdata?.appinfo?.versionCode?.toString() ?? 1;
			ymlData.versionInfo.versionName = appdata?.appinfo?.versionName ?? "1.0";

			fs.writeFileSync(ymlPath, "!!brut.androlib.meta.MetaInfo\n" + JSY_Dump(ymlData,), { encoding: "utf-8", flag: "w" });

			const apkValuesDir = cachePath + sep + "res" + sep + "values";

			// strings.xml
			const apkStringsXml = fs.readFileSync(apkValuesDir + sep + "strings.xml", {
				encoding: "utf-8",
				flag: "r"
			});
			const apkStringsData: any = xml2js(apkStringsXml, { compact: true });

			const appname = apkStringsData?.resources?.string?.filter((x: any) => {
				return x?._attributes?.name && x?._attributes?.name == "app_name";
			})[0];

			appname._text = appdata?.appinfo?.appname;

			fs.writeFileSync(apkValuesDir + sep + "strings.xml", js2xml(apkStringsData, {
				compact: true,
				spaces: 4
			}), {
				encoding: "utf-8",
				flag: "w"
			});

			// colors.xml
			const apkColorsXml = fs.readFileSync(apkValuesDir + sep + "colors.xml", {
				encoding: "utf-8",
				flag: "r"
			});
			const apkColorsData: any = xml2js(apkColorsXml, { compact: true });

			const colorPrimary = apkColorsData?.resources?.color?.filter((x: any) => {
				return x?._attributes?.name && x?._attributes?.name == "colorPrimary";
			})[0];

			colorPrimary._text = appdata?.appinfo?.color;

			fs.writeFileSync(apkValuesDir + sep + "colors.xml", js2xml(apkColorsData, {
				compact: true,
				spaces: 4
			}), {
				encoding: "utf-8",
				flag: "w"
			});


			// Copy to assets
			fs.cpSync(appdata.include, cachePath + sep + "assets", {
				recursive: true,
				force: true
			});


			// Recompile and move
			console.log("Building...");
			closeLog("$> " + com["apktool_b"]);
			await exec(com["apktool_b"]);

			fs.rename(__dirname + sep + "output.apk", appdata?.output, (err) => {
				if (err) { throw err; }
				console.log('Successfully build apk')
			});

		} break;

		case "sign":
		case "s": {
			if (argv2[1] && argv2[1] == "help") {
				console.log(helpTxt["sign"]);
				break;
			}

			const apkPath = argv2[1];
			if (!apkPath) {
				console.log("! Keytool is part of JDK (required)");
				console.log("To generate a keystore use: (change: my-keystore.keystore, name_alias)");
				console.log("keytool -genkey -v -keystore my-keystore.keystore -alias name_alias -keyalg RSA -validity 10000");
				break;
			}

			if (!fs.existsSync(apkPath) || !fs.lstatSync(apkPath).isFile()) {
				throw "Not such file '" + apkPath + "'";
			}

			const keystore = argv2[2] ?? __dirname + sep + "debug.keystore";
			const passw = argv2[3] ?? "123456";

			if (!Global.config?.sdkBuildTools) {
				console.log("For legal issues we cannot pack any SDK from android inside AndroidJS");
				console.log("You need to setup SDK BuildTools Path for AndroidJS (Usually is: "
					+ (Global.isWin
						? "C:\\Users\\{Username}\\AppData\\Local\\Android\\Sdk\\build-tools\\31.0.0"
						: "<sdk>/build-tools/31.0.0") + ")");
				console.log();

				Global.config.sdkBuildTools = prompt("SDK Path? ");
				if (!Global.config?.sdkBuildTools) { throw "No SDK provided, sign by yourself"; }

				saveConfig(Global.config);
			}


			// Prepare
			const zipalign = Global.config.sdkBuildTools + sep + "zipalign -p 4 \"" + apkPath + "\" \"" + apkPath + ".aligned\"";
			const apksigner = Global.config.sdkBuildTools + sep + "apksigner sign --ks \"" + keystore + "\" --ks-pass pass:" + passw + " --v1-signing-enabled true --v2-signing-enabled true --out \"" + apkPath + "\" \"" + apkPath + ".aligned\"";

			// Go
			console.log("Signing...");

			closeLog("$> " + zipalign);
			await exec(zipalign);

			closeLog("$> " + apksigner);
			await exec(apksigner);

			fs.rm(apkPath + ".aligned", (err) => {
				if (err) { throw err; }
			});

		} break;

		default: {
			console.log("Nothing to do. Type 'androidjs --help' to get more information");
		} break;
	}

}
