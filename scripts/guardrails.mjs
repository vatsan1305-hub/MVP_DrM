// Keeps the Companion system prompt in lambda/index.mjs identical to guardrails.md.
//   node scripts/guardrails.mjs          → check (exit 1 if they differ)
//   node scripts/guardrails.mjs --write  → copy guardrails.md into the Lambda
import { readFileSync, writeFileSync } from "node:fs";

const HEADING = "## SYSTEM PROMPT";
const LAMBDA = "lambda/index.mjs";
const BLOCK = /(\/\/ BEGIN SYSTEM PROMPT\nconst SYSTEM_PROMPT = `)([\s\S]*?)(`;\n\/\/ END SYSTEM PROMPT)/;

const md = readFileSync("guardrails.md", "utf8").replace(/\r\n/g, "\n");
const start = md.split("\n").findIndex((l) => l.startsWith(HEADING));
if (start === -1) throw new Error(`guardrails.md: "${HEADING}" heading not found`);
const prompt = md.split("\n").slice(start + 1).join("\n").trim();
const escaped = prompt.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

const src = readFileSync(LAMBDA, "utf8");
const match = src.match(BLOCK);
if (!match) throw new Error(`${LAMBDA}: SYSTEM PROMPT markers not found`);

if (process.argv.includes("--write")) {
  writeFileSync(LAMBDA, src.replace(BLOCK, (_, a, _b, c) => a + escaped + c));
  console.log(`Copied guardrails.md system prompt into ${LAMBDA}`);
} else if (match[2] !== escaped) {
  console.error(`${LAMBDA} system prompt differs from guardrails.md — run: npm run sync:guardrails`);
  process.exit(1);
} else {
  console.log("Guardrails in sync.");
}
