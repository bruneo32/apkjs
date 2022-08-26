export interface Appdata {
	include: string,
	output: string,
	appinfo: Appinfo
}

export interface Appinfo {

	package: string,
	appname: string,
	versionCode: number,
	versionName: number,

	color: string,
	icons: any
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
