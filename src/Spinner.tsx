import "./Spinner.css";

import type { Element } from "@b9g/crank";

const Spinner = (): Element => (
  <div class={"sk-chase w-5 h-5 text-gray-700 dark:text-slate-300"}>
    <div class="sk-chase-dot" />
    <div class="sk-chase-dot" />
    <div class="sk-chase-dot" />
    <div class="sk-chase-dot" />
    <div class="sk-chase-dot" />
    <div class="sk-chase-dot" />
  </div>
);
export default Spinner;

export const CenteredSpinner = (): Element => (
  <div class="flex items-center justify-center">
    <Spinner />
  </div>
);
