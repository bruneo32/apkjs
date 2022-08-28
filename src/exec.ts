import { exec as ex } from "child_process";
import util from "node:util";
import { closeLog, LOG_LEVEL } from "./logger";

const execPromise = util.promisify(ex);

export async function exec(cmd: string) {
	try {

		await execPromise(cmd).then((e: { stdout: any, stderr: any }) => {
			// if (e.stdout) { closeLog(e.stdout, LOG_LEVEL.INFO); }
			if (e.stderr) { closeLog(e.stderr, LOG_LEVEL.ERROR); }
		});

	} catch (err: any) {
		if (err) { throw err; }
	}
}
