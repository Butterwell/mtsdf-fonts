# mtsdf-fonts
Scripts to generate mtsdf fonts and associated metadata (for Babylon.js)

## ======== NO LONGER MAINTAINED ========

## Use
See TODO put playground reference here

## Developer Setup (to generate additional fonts or whatnot)

Clone and build or otherwise install https://github.com/Chlumsky/msdf-atlas-gen in a sibling directory.
Clone or download https://github.com/google/fonts somewhere.
Edit src/generate.ts to 'point' to it. Then:

    yarn install
    yarn tsc
    node lib/generate.js

