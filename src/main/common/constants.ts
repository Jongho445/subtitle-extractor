import path from "path";
import fs from "fs-extra";

const projectName = "subtitle-extractor"
const rootPath = __dirname.split(projectName)[0] + projectName;
const jsonPath = path.resolve(rootPath, "assets", "config", "config.json");
const config = fs.readJsonSync(jsonPath);

export default {
  path: {
    default: {
      inputPath: config.inputPath,
      outputPath: config.outputPath
    },
    root: rootPath,
    result: path.resolve(rootPath, "result"),
    assets: path.resolve(rootPath, "assets"),
    ffmpeg: path.resolve(rootPath, "assets", "ffmpeg", "ffmpeg.exe")
  },
  support: {
    video: ["mkv", "mp4"],
    subtitle: ["ass"]
  }
}
