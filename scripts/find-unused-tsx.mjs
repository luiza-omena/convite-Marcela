import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const srcRoot = path.join(workspaceRoot, "src");

/** @param {string} p */
function toPosix(p) {
  return p.split(path.sep).join("/");
}

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** @param {string} abs */
function readText(abs) {
  try {
    return fs.readFileSync(abs, "utf8");
  } catch {
    return "";
  }
}

/**
 * Resolve an import specifier into an existing absolute file path.
 * Supports:
 * - relative imports: ./foo, ../bar
 * - alias imports: @/... -> <root>/src/...
 * - extensionless resolution: .ts/.tsx and /index.ts(x)
 * @param {string} fromFileAbs
 * @param {string} spec
 */
function resolveImport(fromFileAbs, spec) {
  if (!spec) return null;
  if (spec.startsWith("node:")) return null;
  if (!spec.startsWith(".") && !spec.startsWith("@/")) return null; // external package

  const base =
    spec.startsWith("@/")
      ? path.join(srcRoot, spec.slice(2))
      : path.resolve(path.dirname(fromFileAbs), spec);

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

const allSrcFiles = walk(srcRoot).filter((p) => /\.(ts|tsx)$/.test(p));
const allTsxFiles = allSrcFiles.filter((p) => p.endsWith(".tsx"));

// entrypoints (conservador): main.tsx + qualquer página usada pelo router será alcançada via imports
const entry = path.join(srcRoot, "main.tsx");
if (!fs.existsSync(entry)) {
  console.error("Could not find src/main.tsx");
  process.exit(2);
}

/** @type {Map<string, Set<string>>} */
const graph = new Map();

const importRegex =
  /(?:import|export)\s+(?:type\s+)?[^'"]*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

for (const file of allSrcFiles) {
  const text = readText(file);
  /** @type {Set<string>} */
  const deps = new Set();
  let m;
  while ((m = importRegex.exec(text))) {
    const spec = m[1] || m[2];
    const resolved = resolveImport(file, spec);
    if (resolved) deps.add(resolved);
  }
  graph.set(file, deps);
}

/** @type {Set<string>} */
const reachable = new Set();
/** @type {string[]} */
const stack = [entry];

while (stack.length) {
  const cur = stack.pop();
  if (!cur || reachable.has(cur)) continue;
  reachable.add(cur);
  const deps = graph.get(cur);
  if (!deps) continue;
  for (const d of deps) {
    if (!reachable.has(d)) stack.push(d);
  }
}

// Find TSX files not in the import graph
const unusedTsx = allTsxFiles
  .filter((f) => !reachable.has(f))
  .map((abs) => toPosix(path.relative(workspaceRoot, abs)))
  .sort();

process.stdout.write(unusedTsx.join("\n"));
