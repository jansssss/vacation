import { spawnSync } from "child_process";

const shouldRun = process.env.VERCEL === "1" || process.env.REACT_SNAP === "true";

if (!shouldRun) {
  console.log("react-snap skipped (set VERCEL=1 or REACT_SNAP=true to enable)");
  process.exit(0);
}

const result = spawnSync(
  process.execPath,
  ["node_modules/react-snap/bin/react-snap.js"],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
