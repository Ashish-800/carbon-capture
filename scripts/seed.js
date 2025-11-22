// scripts/upgrade-and-zip.js
// Run from repo root: node scripts/upgrade-and-zip.js

const fs = require("fs");
const path = require("path");
const zip = require("jszip");
const archiver = require("archiver");

const root = process.cwd();
const outZip = path.join(root, "firecarbon.zip");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");
}

function safeRemove(p) {
  if (fs.existsSync(p)) {
    if (fs.lstatSync(p).isDirectory()) {
      fs.rmSync(p, { recursive: true, force: true });
    } else {
      fs.unlinkSync(p);
    }
  }
}

console.log("Starting upgrade & zip process in", root);

// 1) Backup package.json
const pkgPath = path.join(root, "package.json");
if (!fs.existsSync(pkgPath)) {
  console.error("package.json not found in project root. Aborting.");
  process.exit(1);
}
const pkg = readJson(pkgPath);
fs.copyFileSync(pkgPath, pkgPath + ".bak");

// 2) Remove firebase configs if present
[".firebaserc", "firebase.json", "apphosting.yaml", ".firebase"].forEach((f) => {
  safeRemove(path.join(root, f));
});

// 3) Remove .env (but create .env.example)
safeRemove(path.join(root, ".env"));
const envExamplePath = path.join(root, ".env.example");
if (!fs.existsSync(envExamplePath)) {
  fs.writeFileSync(
    envExamplePath,
    "# Environment variables removed for distribution\nPORT=3000\n"
  );
}

// 4) Convert next.config.ts -> next.config.js
const nextTs = path.join(root, "next.config.ts");
const nextJs = path.join(root, "next.config.js");
if (fs.existsSync(nextTs)) {
  const jsContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com','raw.githubusercontent.com'],
    formats: ['image/avif','image/webp']
  },
  experimental: {}
}
module.exports = nextConfig;
`;
  fs.writeFileSync(nextJs, jsContent, "utf8");
  safeRemove(nextTs);
}

// 5) Update package.json for Next 15 (non-destructive; keeps other deps)
pkg.dependencies = pkg.dependencies || {};
pkg.devDependencies = pkg.devDependencies || {};

// Remove firebase & genkit & eslint-config-next if present
["firebase", "firebase-admin", "firebase-tools", "@genkit-ai/next", "eslint-config-next"].forEach(
  (n) => {
    if (pkg.dependencies[n]) delete pkg.dependencies[n];
    if (pkg.devDependencies[n]) delete pkg.devDependencies[n];
  }
);

// Set Next 15 and ensure react/react-dom exist
pkg.dependencies.next = "15.5.6";
pkg.dependencies.react = pkg.dependencies.react || pkg.dependencies["react"] || "18.3.1";
pkg.dependencies["react-dom"] = pkg.dependencies["react-dom"] || pkg.dependencies.react;

// Ensure devDependencies for tailwind plugin and modern eslint
pkg.devDependencies.tailwindcss = pkg.devDependencies.tailwindcss || "^3.4.10";
pkg.devDependencies.postcss = pkg.devDependencies.postcss || "^8.4.35";
pkg.devDependencies.autoprefixer = pkg.devDependencies.autoprefixer || "^10.4.20";
pkg.devDependencies["tailwindcss-animate"] = pkg.devDependencies["tailwindcss-animate"] || "^1.0.4";
pkg.devDependencies.eslint = pkg.devDependencies.eslint || "^9.39.1";
pkg.devDependencies.prettier = pkg.devDependencies.prettier || "^3.2.5";
pkg.devDependencies.typescript = pkg.devDependencies.typescript || "^5.6.3";

// Ensure scripts
pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = pkg.scripts.dev || "next dev";
pkg.scripts.build = pkg.scripts.build || "next build";
pkg.scripts.start = pkg.scripts.start || "next start -p $PORT";
pkg.scripts.lint = pkg.scripts.lint || "eslint . --ext .ts,.tsx --fix";
pkg.scripts.format = pkg.scripts.format || "prettier --write .";

writeJson(pkgPath, pkg);
console.log("Updated package.json");

// 6) Update tailwind.config.ts if present to include tailwindcss-animate and correct content
const tailwindTs = path.join(root, "tailwind.config.ts");
if (fs.existsSync(tailwindTs)) {
  let ttxt = fs.readFileSync(tailwindTs, "utf8");
  ttxt = ttxt.replace(/content:\s*\[[^\]]*\]/, 'content: ["./src/**/*.{js,ts,jsx,tsx,mdx}","./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx}"]');
  if (!/tailwindcss-animate/.test(ttxt)) {
    if (/plugins\s*:\s*\[/.test(ttxt)) {
      ttxt = ttxt.replace(/plugins\s*:\s*\[/, "plugins: [require('tailwindcss-animate'), ");
    } else {
      ttxt += "\nexport default { plugins: [require('tailwindcss-animate')] }\n";
    }
  }
  fs.writeFileSync(tailwindTs, ttxt, "utf8");
  console.log("Patched tailwind.config.ts");
}

// 7) Neutralize firebase initialization in source files
function neutralizeFirebaseInFile(fp) {
  let s = fs.readFileSync(fp, "utf8");
  if (s.includes("initializeApp(") || s.includes("getFirestore(") || s.includes("getAuth(") || s.includes("from 'firebase'") || s.includes("from \"firebase\"")) {
    s = s.replace(/import\s+.*firebase.*\n/g, "// firebase import removed\n");
    s = s.replace(/.*initializeApp\\([^\\)]*\\).*;?\\n?/g, "// firebase initialize removed\n");
    s = s.replace(/.*getFirestore\\([^\\)]*\\).*;?\\n?/g, "// getFirestore removed\n");
    s = s.replace(/.*getAuth\\([^\\)]*\\).*;?\\n?/g, "// getAuth removed\n");
    fs.writeFileSync(fp, s, "utf8");
    return true;
  }
  return false;
}
const exts = [".js", ".ts", ".tsx", ".jsx"];
function walkAndNeutralize(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (["node_modules", ".next", ".git", "workspace", ".cache", "dist"].includes(e.name)) return;
      walkAndNeutralize(p);
    } else {
      if (exts.includes(path.extname(e.name))) {
        const changed = neutralizeFirebaseInFile(p);
        if (changed) console.log("Neutralized firebase in", p);
      }
    }
  });
}
walkAndNeutralize(root);

// 8) Create zip excluding heavy folders
if (fs.existsSync(outZip)) fs.unlinkSync(outZip);
const output = fs.createWriteStream(outZip);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log("Created:", outZip);
});
archive.on("error", function (err) {
  throw err;
});
archive.pipe(output);

// add files
function addFolderToArchive(folder, baseInZip) {
  const items = fs.readdirSync(folder, { withFileTypes: true });
  items.forEach((it) => {
    const full = path.join(folder, it.name);
    const rel = path.join(baseInZip, it.name);
    if (it.isDirectory()) {
      if (["node_modules", ".next", ".git", "workspace", ".cache", "dist"].includes(it.name)) return;
      addFolderToArchive(full, rel);
    } else {
      archive.file(full, { name: rel });
    }
  });
}

addFolderToArchive(root, ".");
archive.finalize();
