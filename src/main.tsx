/** @jsxImportSource @b9g/crank */
import "./main.css";

import type { Component, Context } from "@b9g/crank";
import { renderer } from "@b9g/crank/dom";

import { Wave } from "./Wave";
import { Wizard } from "./Wizard";

const Home = () => (
  <div class="flex h-screen flex-col bg-cyan-700">
    <Wave />
    <div class="absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-y-auto">
      <div class="flex flex-col items-center justify-start py-12 h-full w-full max-w-screen-md space-y-12">
        <h1
          class="text-8xl bg-orange-400 rounded-xl w-full text-center py-6 text-white shadow-2xl select-none"
          style={{ "font-family": "Rubik Doodle Shadow" }}
        >
          Concert
        </h1>
        <Wizard />
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
      const basePath = import.meta.env.BASE_URL;
      const path = window.location.pathname.substring(basePath.length) || "/";
      const Route = routes[path];
      yield (
        <div class="flex h-screen flex-col">
          <Route x={Math.random()} />
        </div>
      );
    }
  } finally {
    window.removeEventListener("popstate", onPopState);
  }
}

const App = () => (
  <div>
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
