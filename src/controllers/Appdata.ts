export interface Appdata {
	include: string,
	output: string,
	appinfo: Appinfo
}

export interface Appinfo {
	package: string,
	appname: string,
	versionCode: number,
	versionName: string,

	color: string,
	icon: string
}

export interface AppYml {
	packageInfo: {
		renameManifestPackage: string
	},
	versionInfo: {
		versionCode: string,
		versionName: string
	}
}

export function errorAppdata(appdata: Appdata): string {
	if (!appdata?.include) {
		return "No 'include' field in appdata.json";
	}
	if (!appdata?.output) {
		return "No 'output' field in appdata.json";
	}
	if (!appdata?.appinfo) {
		return "No 'appinfo' field in appdata.json";
	}
	if (!appdata?.appinfo.package) {
		return "No 'appinfo/package' field in appdata.json";
	}
	if (!appdata?.appinfo.appname) {
		return "No 'appinfo/appname' field in appdata.json";
	}

	return "";
}
