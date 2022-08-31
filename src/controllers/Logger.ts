import { writeFile } from "fs";
import { sep } from "path";

const __basedir = __dirname + sep + "..";

export const logPath = {
	info: __basedir + sep + "info.log",
	error: __basedir + sep + "error.log"
};

export enum LOG_LEVEL {
	INFO = 0,
	ERROR,
};

export async function closeLog(logEntry: string, logLevel?: number) {
	const dt: string = devDate(new Date()); // DateTime Stamp

	if (!logLevel) { logLevel = LOG_LEVEL.INFO; }
	const dumpFile = (logLevel == LOG_LEVEL.ERROR) ? logPath.error : logPath.info;

	writeFile(dumpFile, "[" + dt + "]\t" + logEntry + "\n", {
		encoding: "utf-8",
		flag: "a"
	}, (err) => {
		if (err) { throw err; }
	});
}

export function devDate(date: Date): string {
	return date.toLocaleDateString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC",
		timeZoneName: "short"
	});
}
