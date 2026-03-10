#!/usr/bin/env node
//
// Build script: embeds the pen-data.json into code.js
// to produce a self-contained Figma plugin.
//
// Usage: node build.js
//

const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "pen-data.json");
const templatePath = path.join(__dirname, "code.js");
const outPath = path.join(__dirname, "code.js");

if (!fs.existsSync(dataPath)) {
  console.error("pen-data.json not found. Run the export first.");
  process.exit(1);
}

const penData = fs.readFileSync(dataPath, "utf-8").trim();
let template = fs.readFileSync(templatePath, "utf-8");

template = template.replace(
  'const PEN_DATA = "__PEN_DATA_PLACEHOLDER__";',
  `const PEN_DATA = ${penData};`
);

fs.writeFileSync(outPath, template, "utf-8");
console.log("Build complete. code.js now contains embedded pen data.");
console.log("Open Figma → Plugins → Development → Import plugin from manifest...");
console.log("Select: " + path.join(__dirname, "manifest.json"));
