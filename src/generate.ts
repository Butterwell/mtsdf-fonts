import fs from "fs-extra";
import { oneFontFamily } from "./oneFontFamily";

// Instead of selecting certain fonts, we could do them all by
// globing through the Google/fonts repository

const popular = [
  'apache/roboto',
  //'apache/opensans', // Opensans is only variable in Google/fonts
  'ofl/notosans',
  'ofl/lato',
  'ofl/montserrat',
  'ofl/sourcesanspro',
  'ofl/oswald',
  'ofl/poppins',
]

const trending = [ // 6/24/2021
  'ofl/benne',
  'ofl/bigshouldersstencildisplay',
  'ofl/viaodalibre',
]

const oneFontSource = (fontName: string) => {
  oneFontFamily(fontName, '/Users/chris/Downloads/fonts-main/')
}

const go = async () => {
  await fs.emptyDir('fonts');
  popular.forEach(oneFontSource)
  trending.forEach(oneFontSource)
}

go()
