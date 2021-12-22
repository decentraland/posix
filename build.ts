/// <reference path="./node_modules/@types/node/index.d.ts" />

import * as path from "path"
import * as fs from "fs"

sanitizeAmbientDeclarations("index.d.ts")
sanitizeAmbientDeclarations("types/full.d.ts")
sanitizeAmbientDeclarations("types/beta.d.ts")

/**
 * @returns the resolved absolute path
 */
function ensureFileExists(root: string, file: string) {
  const x = path.resolve(root, file.replace(/^\//, ""))

  if (!fs.existsSync(x)) {
    throw new Error(`${x} does not exist`)
  }

  return x
}

// converts a module export into ambient declaration files
function sanitizeAmbientDeclarations(file: string) {
  const dtsFile = ensureFileExists(process.cwd(), file)
  {
    let content = fs.readFileSync(dtsFile).toString()

    content = content.replace(/^export declare/gm, "declare")

    content = content.replace(/^export \{([\s\n\r]*)\}/gm, "")

    content = content + '\ndeclare var dcl: DecentralandInterface'

    fs.writeFileSync(dtsFile, content)

    if (content.match(/\benum\b/)) {
      throw new Error(`The file ${dtsFile} contains enums:\n${content}`)
    }

    if (content.match(/\bexport\b/)) {
      throw new Error(`The file ${dtsFile} contains exports:\n${content}`)
    }

    if (content.match(/\bimport\b/)) {
      throw new Error(`The file ${dtsFile} contains imports:\n${content}`)
    }

    if (content.includes("/// <ref")) {
      throw new Error(`The file ${dtsFile} contains '/// <ref':\n${content}`)
    }
  }
}
