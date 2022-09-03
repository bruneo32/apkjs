import { sep } from "path";

const __basedir = __dirname;

export const com = {
	"apktool_d": "java -jar \"" + __basedir + sep + "apktool.jar\" d \"" + __basedir + sep + "base.apk\" -o \"" + __basedir + sep + "__apk__\"",
	"apktool_b": "java -jar \"" + __basedir + sep + "apktool.jar\" b \"" + __basedir + sep + "__apk__\" -o \"" + __basedir + sep + "output.apk\""
};
