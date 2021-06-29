import { loadSync, Font } from 'opentype.js'
const fs = require('fs');

const getSpecGlyph = (unicode:number, glyphs:  Record<string, any>[]) => {
    for(let i = 0; i < glyphs.length; i++) {
        if (glyphs[i].unicode == unicode) return glyphs[i]
    }
    return {}
}

const exists = (unicode:number, glyphs: any[]) => {
    let check = glyphs.reduce((prev, glyph) => prev || glyph.unicode === unicode, false)
    return check
}

const getFontSpec = (jsonFile: string) => {
    try {
        let data = fs.readFileSync(jsonFile)
        let fontSpec: Record<string, any> = JSON.parse(data)
        return fontSpec
    } catch (error) {
        console.log('Json file not found', error)
        return {}
    }
}

const loadFiles = (ttfFilename: string, jsonFilename: string) => {
    const fontSpec: Record<string, any> = getFontSpec(jsonFilename)
    const font = loadSync(ttfFilename);
    return {
        fontSpec,
        font
    }
}

const buildJson = (ttfFilename: string, jsonFilename: string) => {
    const {fontSpec, font} = loadFiles(ttfFilename, jsonFilename)
    const {count, kerning} = genKerning(fontSpec, font)
    const atlasUvs = genAtlasUvs(fontSpec)
    const chars = genChars(fontSpec)
    console.log('Rewrite', jsonFilename)
    let built: Record<string, any> = {
        kerning,
        atlasUvs,
        chars
    }
    let string = JSON.stringify(built)
    fs.writeFileSync(jsonFilename, string);
}

const genKerning = (fontSpec: Record<string, any>, font: Font) => {
    let count = 0;
    let kerning: Record<string, Record<string, number>> = {};
    for(let i = 0; i < font.glyphs.length; i++) {
        let gatherCount = 0
        let gather: Record<string, number> = {}
        let leftUnicode = font.glyphs.get(i).unicode
        if (exists(leftUnicode, fontSpec.glyphs)) {
            for (let j = 0; j < font.glyphs.length; j++) {
                let rightUnicode = font.glyphs.get(j).unicode
                if (exists(rightUnicode, fontSpec.glyphs)) {
                    let kern = font.getKerningValue(i, j)
                    if (kern !== 0) {
                        gatherCount++            
                        let rightGlyph = font.glyphs.get(j)
                        let specGlyph:  Record<string, any> = getSpecGlyph(rightGlyph.unicode, fontSpec.glyphs)
                        if (specGlyph !== {}) {
                            // Apply the advance ratio to 'fix' the kern values
                            // (The ratio between what msdf-atlas-gen's json and the opentype.js value)
                            let adjust = specGlyph.advance/rightGlyph.advanceWidth
                            let right = String.fromCharCode(rightGlyph.unicode)
                            gather[right] = kern*adjust
                        }
                    }
                }
            }
        }
        if (gatherCount !== 0) {
            let leftGlyph = font.glyphs.get(i)
            let left = String.fromCharCode(leftGlyph.unicode)
            kerning[left] = gather
        }
        count += gatherCount
    }
    return { count, kerning }
}

// Generate in a form that can be easily copied to a Float32Array
const genFontUv = function(glyph: Record<string, any>, atlas: Record<string, any>) {
    if (!glyph.atlasBounds) return [0, 0, 0, 0]
    let x = glyph.atlasBounds.left / atlas.width
    let y = glyph.atlasBounds.bottom / atlas.height
    let width = (glyph.atlasBounds.right - glyph.atlasBounds.left) / atlas.width
    let height = (glyph.atlasBounds.top - glyph.atlasBounds.bottom) / atlas.height
    return [x, y, width, height]
}

const genAtlasUvs = (fontSpec: Record<string, any>) => {
    let atlasUvs: Record<string, any> = {}
    fontSpec.glyphs.forEach((glyph: Record<string, any>) => {
        let char = String.fromCharCode(glyph.unicode)
        let atlasUv = genFontUv(glyph, fontSpec.atlas)
        atlasUvs[char] = atlasUv 
    })
    return atlasUvs
}

const genChars = (fontSpec: Record<string, any>) => {
    let chars: Record<string, any> = {}
    fontSpec.glyphs.forEach((glyph: Record<string, any>) => {
        let char = String.fromCharCode(glyph.unicode)
        chars[char] = glyph
    })
    return chars
}

export { buildJson };

