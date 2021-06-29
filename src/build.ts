import { exec } from "child_process";
import { buildJson } from "./buildJson";

const build = async (ttf: string, png: string, json: string): Promise<void> => {
    let command = '../msdf-atlas-gen/bin/msdf-atlas-gen -font ' + ttf + ' -imageout ' + png + ' -json ' + json
        await exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(command)
            //console.log(`stdout: ${stdout}`);
            buildJson(ttf, json)
    })
}
export { build };