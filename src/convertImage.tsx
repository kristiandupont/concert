import { call } from "@xn-sakina/image-magick";

export async function convertImage(
  file: File,
  resultFilename: string,
): Promise<Blob> {
  const content = new Uint8Array((await file.arrayBuffer()) as ArrayBuffer);
  const image = { name: file.name, content };
  const command = ["convert", file.name, resultFilename];
  const result = await call([image], command);

  if (result.exitCode !== 0) {
    throw new Error(result.stderr.join("\n"));
  }

  const outputImage = result.outputFiles[0];
  const blob = new Blob([(outputImage as any).buffer]);
  return blob;
}
