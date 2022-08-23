// import { exec } from "child_process";

const VERSION = 0.1;
const OS: string = process.platform.toLowerCase().includes("win") ? "win" : process.platform.toLowerCase().includes("linux") ? "linux" : process.platform.toLowerCase().includes("mac") ? "macos" : "unknown";

export async function exec(argv2: string[]) {
	console.log(argv2);

	switch (argv2[0]) {
		case "-h":
		case "--help":
			console.log("HELP");
			break;

		case "-v":
		case "--version":
			console.log(VERSION.toFixed(1));
			break;

		case "b":
		case "build":
			console.log(__dirname);

			switch (OS) {
				case "win":
					break;

				case "linux":
					break;

				default:
					console.log("ERR! Unknown OS");
					break;
			}
			break;

		default:
			console.log("Nothing to do. Type 'androidjs --help' to get more information");
			break;
	}

}
