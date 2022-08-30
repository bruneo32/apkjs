import sharp from "sharp";

export async function resizeImage(originalImage: string, outputImage: string, size: { width: number, height: number }) {
	try {
		sharp(originalImage)
			.resize({
				fit: "fill",
				width: size.width,
				height: size.height
			}).toFormat("png", {
				force: true
			}).toFile(outputImage);
	} catch (err) {
		if (err) { throw err; }
	}
}
