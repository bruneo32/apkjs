import { exec as ex } from "child_process";
import util from "node:util";

const execPromise = util.promisify(ex);

export async function exec(cmd: string) {
	try {

		await execPromise(cmd).then((e: { stdout: any, stderr: any }) => {
			if (e.stdout) { console.log(e.stdout); }
			if (e.stderr) { console.error(e.stderr); }
		});

	} catch (err: any) {
		throw err;
	}
}
