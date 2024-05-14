/*
 * VegaViewer.ts
 *
 * Copyright (c) 2023-2024 Xiongfei Shi
 *
 * Author: Xiongfei Shi <xiongfei.shi(a)icloud.com>
 * License: Apache-2.0
 *
 * https://github.com/shixiongfei/vega-plot
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vegaLite from "vega-lite";
import gui from "gui";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const script = (filepath: string) =>
  fs.readFileSync(path.join(dirname, filepath)).toString();

const javascript = (filepath: string) =>
  `<script type="text/javascript">${script(filepath)}</script>`;

const VegaViewer = (title: string) => `
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style type="text/css">
      body { margin: 0px; padding: 0px; }
      #vis { display: inline-block; }
    </style>
  </head>
  <body>
    <div id="vis"></div>
    ${javascript("../vega/vega.min.js")}
    ${javascript("../vega/vega-lite.min.js")}
    ${javascript("../vega/vega-embed.min.js")}
    <script type="text/javascript">
      function doEmbed(spec) {
        vegaEmbed("#vis", spec, { actions: false }).then(function (result) {
          var view = result.view;
          var container = view.container();
          view.addResizeListener(function (width, height) {
            window.innerWidth = container.offsetWidth;
            window.innerHeight = container.offsetHeight;
            resize(container.offsetWidth, container.offsetHeight);
          });
          resize(container.offsetWidth, container.offsetHeight);
        });
      }
    </script>
  </body>
</html>`;

const showWindow = (vlSpec: vegaLite.TopLevelSpec) => {
  const window = gui.Window.create({});
  const contentview = gui.Container.create();
  const browser = gui.Browser.create({
    hardwareAcceleration: true,
    webview2Support: true,
  });

  browser.addBinding("resize", (width: number, height: number) => {
    window.setTitle(`${browser.getTitle()} #${process.pid}`);
    window.setContentSize({ width, height });
    window.center();
  });

  browser.onFinishNavigation = () => {
    browser.executeJavaScript(
      `doEmbed(${JSON.stringify(vlSpec)});`,
      (result: boolean) => {
        if (!result) {
          console.error("Plot script execution failed, please try again!");
          gui.MessageLoop.quit();
        }
      },
    );
  };

  browser.setStyle({ flex: 1 });
  browser.loadHTML(VegaViewer("Vega Viewer"), "");

  contentview.setStyle({ flexDirection: "row" });
  contentview.addChildView(browser);

  window.onClose = () => gui.MessageLoop.quit();
  window.setContentView(contentview);
  window.setResizable(false);
  window.activate();

  if (!process.versions.yode) {
    gui.MessageLoop.run();
    process.exit(0);
  }
};

export default { showWindow };
