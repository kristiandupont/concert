import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
const baseURL = `${window.location}/ffmpeg-esm`;

const ffmpeg = new FFmpeg();
ffmpeg.on("log", ({ message }) => console.info("FFmpeg log:", message));

async function loadFFmpeg() {
  console.info("Loading FFmpeg...");
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    workerURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      "text/javascript",
    ),
  });
  console.info("FFmpeg loaded");
}
loadFFmpeg();

export async function convertAudioOrVideo(
  file: File,
  resultFilename: string,
): Promise<Blob> {
  const input = await fetchFile(file);

  await ffmpeg.writeFile("input", input);
  await ffmpeg.exec(["-i", "input", resultFilename]);
  const fileData = await ffmpeg.readFile(resultFilename);
  const data = new Uint8Array(fileData as ArrayBuffer);
  const blob = new Blob([data.buffer]);
  return blob;
}
