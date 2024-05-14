/*
 * index.test.ts
 *
 * Copyright (c) 2023-2024 Xiongfei Shi
 *
 * Author: Xiongfei Shi <xiongfei.shi(a)icloud.com>
 * License: Apache-2.0
 *
 * https://github.com/shixiongfei/vega-plot
 */

import { plot } from "./index.js";

plot({
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "A simple bar chart with embedded data.",
  width: 400,
  height: 300,
  data: {
    values: [
      { a: "A", b: 28 },
      { a: "B", b: 55 },
      { a: "C", b: 43 },
      { a: "D", b: 91 },
      { a: "E", b: 81 },
      { a: "F", b: 53 },
      { a: "G", b: 19 },
      { a: "H", b: 87 },
      { a: "I", b: 52 },
    ],
  },
  mark: "bar",
  encoding: {
    x: { field: "a", type: "ordinal" },
    y: { field: "b", type: "quantitative" },
    tooltip: [
      { field: "a", type: "ordinal" },
      { field: "b", type: "quantitative" },
    ],
  },
});

plot({
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Plots two functions using a generated sequence.",
  width: 300,
  height: 150,
  data: {
    sequence: {
      start: 0,
      stop: 12.7,
      step: 0.1,
      as: "x",
    },
  },
  transform: [
    { calculate: "sin(datum.x)", as: "sin(x)" },
    { calculate: "cos(datum.x)", as: "cos(x)" },
    { fold: ["sin(x)", "cos(x)"] },
  ],
  mark: "line",
  encoding: {
    x: { type: "quantitative", field: "x" },
    y: { field: "value", type: "quantitative" },
    color: { field: "key", type: "nominal", title: null },
  },
});
