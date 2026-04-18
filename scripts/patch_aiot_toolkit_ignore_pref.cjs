#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const rootDir = path.resolve(__dirname, "..")
const pnpmDir = path.join(rootDir, "node_modules", ".pnpm")
const npmTarget = path.join(
  rootDir,
  "node_modules",
  "@aiot-toolkit",
  "aiotpack",
  "lib",
  "config",
  "UxConfig.js"
)

const TARGET_SUFFIX = path.join(
  "node_modules",
  "@aiot-toolkit",
  "aiotpack",
  "lib",
  "config",
  "UxConfig.js"
)

const EXCLUDE_NEEDLE = "'**/pref{,/**}'"
const WATCH_NEEDLE = "/(^|[\\/\\\\])pref([\\/\\\\]|$)/"

const collectTargets = () => {
  const targets = []

  if (fs.existsSync(pnpmDir)) {
    const entries = fs.readdirSync(pnpmDir)

    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      if (!entry.startsWith("@aiot-toolkit+aiotpack@")) {
        continue
      }

      const targetPath = path.join(pnpmDir, entry, TARGET_SUFFIX)
      if (fs.existsSync(targetPath)) {
        targets.push(targetPath)
      }
    }
  }

  if (fs.existsSync(npmTarget)) {
    targets.push(npmTarget)
  }

  return targets
}

const patchFile = (targetPath) => {
  const source = fs.readFileSync(targetPath, "utf8")

  let output = source

  if (!output.includes(EXCLUDE_NEEDLE)) {
    const excludeFrom = "'**/.git{,/**}', filePath => {"
    const excludeTo = "'**/.git{,/**}', '**/pref{,/**}', filePath => {"
    if (!output.includes(excludeFrom)) {
      throw new Error(`未找到 exclude 插入点: ${targetPath}`)
    }
    output = output.replace(excludeFrom, excludeTo)
  }

  if (!output.includes(WATCH_NEEDLE)) {
    const watchFrom = "watchIgnores = [/node_modules/, /build/, /dist/];"
    const watchTo = "watchIgnores = [/node_modules/, /build/, /dist/, /(^|[\\/\\\\])pref([\\/\\\\]|$)/];"
    if (!output.includes(watchFrom)) {
      throw new Error(`未找到 watchIgnores 插入点: ${targetPath}`)
    }
    output = output.replace(watchFrom, watchTo)
  }

  if (output !== source) {
    fs.writeFileSync(targetPath, output, "utf8")
    return "patched"
  }

  return "unchanged"
}

const targets = collectTargets()

if (!targets.length) {
  console.error("未找到 aiot-toolkit 的 UxConfig.js，请先安装依赖。")
  process.exit(1)
}

let patchedCount = 0
for (let index = 0; index < targets.length; index += 1) {
  const targetPath = targets[index]
  const result = patchFile(targetPath)
  if (result === "patched") {
    patchedCount += 1
  }
  console.log(`[patch-aiot-toolkit] ${result}: ${targetPath}`)
}

console.log(`[patch-aiot-toolkit] done, patched=${patchedCount}, total=${targets.length}`)
