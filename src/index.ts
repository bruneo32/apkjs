import fs from "fs";
import { sep } from "path";
import { load as JSY_Load, dump as JSY_Dump } from "js-yaml";

import { com } from "./cmd";
import { Appdata, AppYml } from "./appdata";
import { exec } from "./exec";
import { closeLog, logPath } from "./logger";


export const Global = {
	VERSION: 0.1
}

export async function main(argv2: string[]) {
	const cachePath = __dirname + sep + "__apk__";

	switch (argv2[0]) {
		case "-h":
		case "--help":
		case "help": {
			console.log("HELP");
		} break;

		case "-v":
		case "--version":
		case "version": {
			console.log(Global.VERSION.toFixed(1));
		} break;

		case "init": {
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

		case "b":
		case "build": {
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
			if (!appdata?.include) {
				throw "No 'include' field in appdata.json";
			}

			if (!appdata?.output) {
				throw "No 'output' field in appdata.json";
			}


			// Decompile base.apk
			// If already decompiled, do not decompile again
			if (!fs.existsSync(cachePath)) {
				console.log("Decoding... (first time, this will be cached)");
				closeLog("$> " + com["apktool_d"]);
				await exec(com["apktool_d"]);
			} else {
				console.log("WARN! Already decoded cache. If unexpected problems, try 'androidjs clear-cache'");
			}


			// Modify APK
			console.log("Creating app");
			console.log(appdata);
			const ymlPath = cachePath + sep + "apktool.yml";


			const ymlData: AppYml = <AppYml>JSY_Load(fs.readFileSync(ymlPath, { encoding: "utf-8", flag: "r" })?.replace("!!brut.androlib.meta.MetaInfo", ""));
			if (!ymlData) { throw "Error reading apktool.yml"; }

			ymlData.packageInfo.renameManifestPackage = appdata?.appinfo?.package;

			fs.writeFileSync(ymlPath, "!!brut.androlib.meta.MetaInfo\n" + JSY_Dump(ymlData,), { encoding: "utf-8", flag: "w" });


			// Recompile and move
			console.log("Building...");
			closeLog("$> " + com["apktool_b"]);
			await exec(com["apktool_b"]);

			fs.rename(__dirname + sep + "output.apk", appdata?.output, (err) => {
				if (err) { throw err; }
				console.log('Successfully build apk')
			});

		} break;


		case "cc":
		case "clear-cache": {
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

		default: {
			console.log("Nothing to do. Type 'androidjs --help' to get more information");
		} break;
	}

}
