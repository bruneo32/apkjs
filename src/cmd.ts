import { sep } from "path";
// import { type as ostype } from "os";

export const com = {
	"apktool_d": "java -jar \"" + __dirname + sep + "apktool.jar\" d \"" + __dirname + sep + "base30.apk\" -o \"" + __dirname + sep + "__apk__\"",
	"apktool_b": "java -jar \"" + __dirname + sep + "apktool.jar\" b \"" + __dirname + sep + "__apk__\" -o \"" + __dirname + sep + "output.apk\""
};
