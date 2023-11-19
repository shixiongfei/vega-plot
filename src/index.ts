/*
 * index.ts
 *
 * Copyright (c) 2023 Xiongfei Shi
 *
 * Author: Xiongfei Shi <xiongfei.shi(a)icloud.com>
 * License: Apache-2.0
 *
 * https://github.com/shixiongfei/vega-plot
 */

import { fileURLToPath } from "node:url";
import { fork } from "node:child_process";
import vega from "vega";
import vegaLite from "vega-lite";
import VegaViewer from "./VegaViewer.js";

export const view = (spec: vega.Spec) =>
  new vega.View(vega.parse(spec), { renderer: "none" });

export const lite = (vlSpec: vegaLite.TopLevelSpec) => {
  const spec = vegaLite.compile(vlSpec).spec;
  return view(spec);
};

let nextAllowTime = new Date().getTime();

const queuedExecute = (callback: () => void, interval = 1000) => {
  const now = new Date().getTime();

  if (now >= nextAllowTime) {
    nextAllowTime += interval;
    return callback();
  }

  setTimeout(callback, nextAllowTime - now);
  nextAllowTime += interval;
};

if (process.argv[2] === "vega-viewer") {
  process.once("message", VegaViewer.showWindow);
}

const filename = fileURLToPath(import.meta.url);

export const plot = (vlSpec: vegaLite.TopLevelSpec) =>
  queuedExecute(() => fork(filename, ["vega-viewer"]).send(vlSpec));

export default { view, lite, plot };
