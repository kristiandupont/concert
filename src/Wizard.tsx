import { Context, Element } from "@b9g/crank";

import { Converter } from "./Converter";
import { FileDropZone } from "./FileDropZone";
import { getFileType } from "./getFileType";

export function* Wizard(this: Context): Generator<Element> {
  const files: File[] = [];

  const onFilesDropped = (droppedFiles: File[]) => {
    const fileTypes = droppedFiles.map(getFileType);
    const uniqueFileTypes = new Set(fileTypes);
    if (uniqueFileTypes.size > 1) {
      alert("Please drop files of the same type");
      return;
    }
    const newFileType = uniqueFileTypes.values().next().value;
    if (newFileType === undefined) {
      alert("Unsupported file type");
      return;
    }

    files.push(...droppedFiles);
    this.refresh();
  };

  while (true) {
    yield (
      <div class="flex flex-col w-full h-full items-center justify-start space-y-12">
        {files.length === 0 && <FileDropZone onFilesDropped={onFilesDropped} />}
        {files.length > 0 && <Converter files={files} />}
      </div>
    );
  }
}
