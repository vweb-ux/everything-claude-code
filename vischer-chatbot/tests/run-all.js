#!/usr/bin/env node
/**
 * tests/run-all.js
 *
 * Führt alle Tests aus und gibt eine Gesamtübersicht.
 * AUSFÜHREN: node tests/run-all.js
 */

"use strict";

const { execSync } = require("child_process");
const path = require("path");

const TEST_FILES = [
  "tests/response-safety.test.js",
  "tests/routing.test.js",
  "tests/team-urls.test.js",
];

let totalPassed = 0;
let totalFailed = 0;
const results = [];

for (const file of TEST_FILES) {
  const filePath = path.resolve(__dirname, "..", file);
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Running: ${file}`);
  console.log("─".repeat(60));

  try {
    const output = execSync(`node "${filePath}"`, {
      encoding: "utf-8",
      cwd: path.resolve(__dirname, ".."),
    });
    process.stdout.write(output);

    const passedMatch = output.match(/Passed:\s*(\d+)/);
    const failedMatch = output.match(/Failed:\s*(\d+)/);
    const p = passedMatch ? parseInt(passedMatch[1], 10) : 0;
    const f = failedMatch ? parseInt(failedMatch[1], 10) : 0;
    totalPassed += p;
    totalFailed += f;
    results.push({ file, passed: p, failed: f, status: f === 0 ? "✅" : "❌" });
  } catch (err) {
    process.stdout.write(err.stdout ?? "");
    process.stderr.write(err.stderr ?? "");
    const passedMatch = (err.stdout ?? "").match(/Passed:\s*(\d+)/);
    const failedMatch = (err.stdout ?? "").match(/Failed:\s*(\d+)/);
    const p = passedMatch ? parseInt(passedMatch[1], 10) : 0;
    const f = failedMatch ? parseInt(failedMatch[1], 10) : 1;
    totalPassed += p;
    totalFailed += f;
    results.push({ file, passed: p, failed: f, status: "❌" });
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log("TEST SUITE SUMMARY");
console.log("=".repeat(60));
for (const { file, passed, failed, status } of results) {
  console.log(`${status}  ${file.padEnd(40)} Passed: ${passed}  Failed: ${failed}`);
}
console.log("─".repeat(60));
console.log(`TOTAL  Passed: ${totalPassed}  Failed: ${totalFailed}`);
console.log("=".repeat(60));

process.exit(totalFailed > 0 ? 1 : 0);
