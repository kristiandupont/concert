import { Element } from "@b9g/crank";

export function FileDropZone({
  onFilesDropped,
}: {
  onFilesDropped: (files: File[]) => void;
}): Element {
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer) {
      return;
    }
    event.dataTransfer.dropEffect = "copy"; // Shows a copy icon on drag over
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer || !event.dataTransfer.files) {
      return;
    }

    // @ts-expect-error - I don't know why TS doesn't think there is an iterator here.
    onFilesDropped([...event.dataTransfer.files]);
  };

  return (
    <div
      className="flex h-64 w-full items-center shadow-2xl text-2xl font-bold justify-center rounded-xl border-4 border-dotted border-cyan-300 bg-cyan-400/60 text-white backdrop-blur-sm"
      ondragover={handleDragOver}
      ondrop={handleDrop}
    >
      Drop image, audio or video files here
    </div>
  );
}
