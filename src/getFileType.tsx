export type FileType = "image" | "video" | "audio";

export const imageExtensions = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "tiff",
  "bmp",
];
export const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
export const audioExtensions = ["mp3", "wav", "ogg", "aiff", "aif", "flac"];

export function getFileType(file: File): FileType | undefined {
  const extension = file.name.split(".").pop();
  if (!extension) {
    return undefined;
  }

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else if (audioExtensions.includes(extension)) {
    return "audio";
  } else {
    return undefined;
  }
}
