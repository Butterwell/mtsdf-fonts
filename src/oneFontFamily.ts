import fs from "fs-extra";
import path from "path";
import { build } from "./build";
const fg = require('fast-glob');

const doFile = async (file: string) : Promise<void> => {
  let extname = path.extname(file)
  let basename = path.basename(file)
  if (extname == '.ttf') {
    // Exclude variable fonts
    if (!~basename.indexOf("[")) {
      inOut(file)
    }
  } else {
    let dirname = path.dirname(file)
    let outDir = 'fonts'+dirname.split('fonts-main')[1]
    let outFile = `${outDir}${path.sep}${basename}`
    await fs.ensureDir(outDir);
    await fs.copy(file, outFile)  
  }
}

const inOut = async (ttf: string) : Promise<void> => {
  let dirname = path.dirname(ttf)
  let basename = path.basename(ttf,'.ttf')
  let outDir = 'fonts'+dirname.split('fonts-main')[1]
  let head = `${outDir}${path.sep}${basename}`
  await fs.ensureDir(outDir);
  let png = `${head}.png`
  let json = `${head}.json`
  build(ttf, png, json)
}

const oneFontFamily = async (fontName: string, fontsMain: string): Promise<void> => {
  // Find all the ttf files for fontName
  let sourceDirectory = fontsMain+fontName
  let fontFiles: string[] = await fg([`${sourceDirectory}/**/*`])

  // Copy the license files files
  // Generate the .png and .json files

  // Set file directories
  fontFiles.forEach(doFile)

};

export { oneFontFamily };