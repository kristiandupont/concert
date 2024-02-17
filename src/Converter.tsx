import type { Context, Element } from "@b9g/crank";

import { convertAudioOrVideo } from "./convertAudioOrVideo";
import { convertImage } from "./convertImage";
import {
  audioExtensions,
  getFileType,
  imageExtensions,
  videoExtensions,
} from "./getFileType";
import Spinner from "./Spinner";

type State = "idle" | "processing" | "complete";

function FileSizeLabel({ fileSize }: { fileSize: number }) {
  const kb = 1024;
  const mb = kb * 1024;

  const label = fileSize < kb ? "bytes" : fileSize < mb ? "KB" : "MB";
  const value =
    fileSize < kb ? fileSize : fileSize < mb ? fileSize / kb : fileSize / mb;

  return (
    <span class="text-xs text-cyan-200">
      {value.toFixed(2)} {label}
    </span>
  );
}

export function* Converter(
  this: Context,
  { files }: { files: File[] },
): Generator<Element> {
  const fileType = getFileType(files[0]);

  const conversionOptions =
    fileType === "image"
      ? imageExtensions
      : fileType === "video"
        ? videoExtensions
        : fileType === "audio"
          ? audioExtensions
          : [];

  let selectedConversionOption = conversionOptions[0];
  let isProcessing = false;

  const onOptionChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    selectedConversionOption = target.value;
  };

  const filesWithState = files.map((file) => ({
    file,
    state: "idle" as State,
    result: undefined as Blob | undefined,
    resultFilename: undefined as string | undefined,
  }));

  const startConversion = async () => {
    isProcessing = true;
    this.refresh();

    for (const fs of filesWithState) {
      fs.state = "processing";
      this.refresh();

      const resultFilename =
        fs.file.name.split(".").shift() + "." + selectedConversionOption;

      let blob: Blob;
      if (fileType === "image") {
        blob = await convertImage(fs.file, resultFilename);
      } else {
        blob = await convertAudioOrVideo(fs.file, resultFilename);
      }

      fs.result = blob;
      fs.resultFilename = resultFilename;
      fs.state = "complete";

      this.refresh();
    }
  };

  while (true) {
    yield (
      <div class="flex flex-col w-full h-full items-center justify-start space-y-6">
        <div className="flex flex-col py-6 w-full items-start px-8 shadow-2xl justify-center rounded-xl border-2 border-cyan-300 bg-cyan-400/80 text-white backdrop-blur-sm">
          <div class="flex flex-col space-y-2 w-full">
            {filesWithState.map((fs) => (
              <div class="flex flex-row items-center justify-between w-full">
                <div class="flex flex-row items-center space-x-2 justify-start">
                  <span class="text-lg">{fs.file.name}</span>
                  <span class="text-xs text-cyan-200">
                    <FileSizeLabel fileSize={fs.file.size} />
                  </span>
                </div>
                {fs.state === "processing" && <Spinner />}
                {fs.result && (
                  <a
                    href={URL.createObjectURL(fs.result)}
                    download={fs.resultFilename}
                  >
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
        {!isProcessing && (
          <>
            <div class="flex flex-row w-full items-center px-8 py-2 shadow-2xl font-bold justify-start space-x-4 rounded-xl border-2 border-cyan-300 bg-cyan-400/80 text-white backdrop-blur-sm">
              <div class="font-bold">Convert to:</div>
              <div>
                <select
                  onchange={onOptionChange}
                  className="bg-cyan-600 px-2 py-0.5 rounded"
                >
                  {conversionOptions.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className="flex flex-row items-center justify-center w-full h-10 rounded-xl bg-pink-500/90 border-pink-400 border-2 text-white text-bold backdrop-blur-sm"
              onclick={startConversion}
            >
              Convert
            </button>
          </>
        )}
      </div>
    );
  }
}
