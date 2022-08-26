import { main } from "./index";

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
	process.exit(2);
});
