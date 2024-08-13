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
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description:
    "A basic bar chart example, with value labels shown upon pointer hover.",
  width: 400,
  height: 200,
  padding: 5,

  data: [
    {
      name: "table",
      values: [
        { category: "A", amount: 28 },
        { category: "B", amount: 55 },
        { category: "C", amount: 43 },
        { category: "D", amount: 91 },
        { category: "E", amount: 81 },
        { category: "F", amount: 53 },
        { category: "G", amount: 19 },
        { category: "H", amount: 87 },
      ],
    },
  ],

  signals: [
    {
      name: "tooltip",
      value: {},
      on: [
        { events: "rect:pointerover", update: "datum" },
        { events: "rect:pointerout", update: "{}" },
      ],
    },
  ],

  scales: [
    {
      name: "xscale",
      type: "band",
      domain: { data: "table", field: "category" },
      range: "width",
      padding: 0.05,
      round: true,
    },
    {
      name: "yscale",
      domain: { data: "table", field: "amount" },
      nice: true,
      range: "height",
    },
  ],

  axes: [
    { orient: "bottom", scale: "xscale" },
    { orient: "left", scale: "yscale" },
  ],

  marks: [
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        enter: {
          x: { scale: "xscale", field: "category" },
          width: { scale: "xscale", band: 1 },
          y: { scale: "yscale", field: "amount" },
          y2: { scale: "yscale", value: 0 },
        },
        update: {
          fill: { value: "steelblue" },
        },
        hover: {
          fill: { value: "red" },
        },
      },
    },
    {
      type: "text",
      encode: {
        enter: {
          align: { value: "center" },
          baseline: { value: "bottom" },
          fill: { value: "#333" },
        },
        update: {
          x: { scale: "xscale", signal: "tooltip.category", band: 0.5 },
          y: { scale: "yscale", signal: "tooltip.amount", offset: -2 },
          text: { signal: "tooltip.amount" },
          fillOpacity: [{ test: "datum === tooltip", value: 0 }, { value: 1 }],
        },
      },
    },
  ],
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
