import { readFileSync, writeFile } from "fs";
import { sep } from "path";

const __basedir = __dirname + sep + "..";

export interface Config {
	sdkBuildTools: string
}

export async function saveConfig(data: object) {
	writeFile(__basedir + sep + "config.json", JSON.stringify(data, null, 2), {
		encoding: "utf-8",
		flag: "w"
	}, (err) => {
		if (err) { throw err; }
	});
}

export function loadConfig(): object {
	try {
		return JSON.parse(readFileSync(__basedir + sep + "config.json", {
			encoding: "utf-8",
			flag: "r"
		}));
	} catch (err) {
		return {};
	}
}
