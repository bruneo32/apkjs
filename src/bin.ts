import { writeFileSync } from "fs";
import { main } from "./index";
import { devDate, logPath } from "./logger";

async function start() {
	if (process.env.CHDIR && process.env.CHDIR !== process.cwd()) {
		// allow to override cwd by CHDIR env var
		// https://github.com/resin-io/etcher/pull/1713
		process.chdir(process.env.CHDIR);
	}
	await main(process.argv.slice(2));
}

start().catch((err: Error) => {
	console.error("ERR!", err?.message ?? err);

	// Log to error.log (cannot use Logger here)
	const logEntry = devDate(new Date()) + ":\tERR! " + (err?.message ?? err) + "\n";
	writeFileSync(logPath.error, logEntry, {
		encoding: "utf-8",
		flag: "a"
	});

	process.exit(2);
});
