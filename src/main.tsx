/** @jsxImportSource @b9g/crank */
import { Component, Context } from "@b9g/crank";
import { renderer } from "@b9g/crank/dom";

import "./main.css";
import { call } from "./magick";
import { Wave } from "./Wave";

async function* FileHandler(this: Context) {
  console.log("mount");
  let files: FileList | null = null;

  const onChange = (e: Event) => {
    console.log("onchange");
    const target = e.target as HTMLInputElement;
    files = target.files;
    if (files) {
      this.refresh();
    }
  };

  while (true) {
    console.log("render");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!files) {
      console.log("A");
      yield (
        <div class="flex h-screen flex-col">
          <div class="flex flex-col">
            <div class="flex flex-row">
              <input
                type="file"
                id="file"
                name="file"
                accept="image/*"
                onchange={onChange}
              />
            </div>
          </div>
        </div>
      );
    } else {
      console.log("B");
      const fs = files as FileList;
      console.log("Processing file...");
      const content = new Uint8Array(
        (await fs.item(0)?.arrayBuffer()) as ArrayBuffer
      );
      const image = { name: "srcFile.png", content };

      const command = [
        "convert",
        "srcFile.png",
        "-rotate",
        "90",
        "-resize",
        "200%",
        "-monitor",
        "out.png",
      ];
      console.log("Calling imagemagick...");
      const result = await call([image], command);
      console.log("Got result: ", result);

      if (result.exitCode !== 0) {
        throw new Error(result.stderr.join("\n"));
      }

      const outputImage = result.outputFiles[0];
      const blob = new Blob([(outputImage as any).buffer]);

      yield (
        <div class="flex h-screen flex-col">
          Result:
          <div class="flex flex-col">
            <img src={URL.createObjectURL(blob)} />
          </div>
        </div>
      );
    }
  }
}

const Home = () => (
  <div class="flex h-screen flex-col bg-cyan-700">
    <Wave />
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full w-full max-w-screen-md space-y-12">
        <h1
          className="text-8xl bg-orange-400 rounded-xl w-full text-center py-6 text-white shadow-2xl select-none"
          style={{ "font-family": "Rubik Doodle Shadow" }}
        >
          Concert
        </h1>
        <div className="flex h-64 w-full items-center shadow-2xl text-2xl font-bold justify-center rounded-xl border-4 border-dotted border-cyan-300 bg-cyan-400/60 text-white backdrop-blur-sm">
          Drop files here
          <FileHandler />
        </div>
      </div>
    </div>
  </div>
);

const routes: Record<string, Component> = {
  "/": Home,
  "/about": () => <div class="flex h-screen flex-col">About</div>,
  "/contact": () => <div class="flex h-screen flex-col">Contact</div>,
};

function* RoutedPanel(this: Context) {
  const onPopState = () => this.refresh();
  window.addEventListener("popstate", onPopState);

  try {
    while (true) {
      const path = window.location.pathname;
      const Route = routes[path];
      yield (
        <div class="flex h-screen flex-col">
          <Route x={Math.random()} />
        </div>
      );
    }
  } finally {
    console.log("unmount");
    window.removeEventListener("popstate", onPopState);
  }
}

function Link({ href, children }: { href: string; children: any }) {
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <a href={href} onclick={onClick}>
      {children}
    </a>
  );
}

const App = () => (
  <div>
    {/* <div className="flex flex-row space-x-2">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </div> */}
    <RoutedPanel />
  </div>
);

(async () => {
  await renderer.render(
    <div>
      <App />
    </div>,
    document.body
  );
})();
