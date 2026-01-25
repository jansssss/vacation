import { spawnSync } from "child_process";
import fs from "fs";

const shouldRun = process.env.VERCEL === "1" || process.env.REACT_SNAP === "true";
const snapBin = "node_modules/react-snap/bin/react-snap.js";

if (!shouldRun) {
  console.log("react-snap skipped (set VERCEL=1 or REACT_SNAP=true to enable)");
  process.exit(0);
}

if (!fs.existsSync(snapBin)) {
  console.log("react-snap skipped (module not installed)");
  process.exit(0);
}

const result = spawnSync(
  process.execPath,
  [snapBin],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
