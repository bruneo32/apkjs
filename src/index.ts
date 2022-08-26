import fs from "fs";
import { com } from "./cmd";
import { sep } from "path";
import { Appdata } from "./appdata";
import { exec } from "./exec";

export const Global = {
	VERSION: 0.1,
}

export async function main(argv2: string[]) {
	console.log(argv2);
	const cachePath = __dirname + sep + "__apk__";

	switch (argv2[0]) {
		case "-h":
		case "--help":
			console.log("HELP");
			break;

		case "-v":
		case "--version":
			console.log(Global.VERSION.toFixed(1));
			break;

		case "b":
		case "build":
			const appdataPath = argv2[1] ?? "appdata.json";
			let appdata: Appdata | null = null;

			try {
				if (!fs.existsSync(appdataPath) || !fs.lstatSync(appdataPath).isFile()) {
					console.error("ERR! Not such file '" + appdataPath + "'");
					break;
				}

				const data = fs.readFileSync(appdataPath, {
					encoding: "utf-8",
					flag: "r"
				});

				appdata = <Appdata>JSON.parse(data);

				// Check basis
				if (!appdata?.include) {
					console.error("ERR! No 'include' field in appdata.json");
					break;
				}

				if (!appdata?.output) {
					console.error("ERR! No 'output' field in appdata.json");
					break;
				}

			} catch (err) {
				console.error("ERR!", err);
				break;
			}

			// If already decompiled the base.apk, do not decompile again
			if (!fs.existsSync(cachePath)) {
				console.log(">", com["apktool_d"]);
				await exec(com["apktool_d"]);
			} else {
				console.log("WARN! Already decompiled cache. If unexpected problems, try 'androidjs clear-cache'");
			}

			console.log(appdata);

			console.log(">", com["apktool_b"]);
			await exec(com["apktool_b"]);

			fs.rename(__dirname + sep + "output.apk", appdata?.output, (err) => {
				if (err) {
					console.error(err?.message);
				}

				console.log('Successfully build apk')
			})

			break;


		case "cc":
		case "clear-cache":
			if (!fs.existsSync(cachePath)) {
				console.log("Cache is already clear");
				break;
			}

			fs.rm(cachePath, {
				recursive: true,
				force: true,
			}, (err) => {
				if (err) {
					console.error("ERR!", err?.message);
				} else {
					console.log("Cache clear successful");
				}
			});

			break;

		default:
			console.log("Nothing to do. Type 'androidjs --help' to get more information");
			break;
	}

}
