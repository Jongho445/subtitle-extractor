import path from "path";

const rootPath = path.join(path.resolve(), "..", "..");

export default {
  path: {
    root: rootPath,
    assets: path.join(rootPath, "assets"),
    ffmpeg: path.join(rootPath, "assets", "ffmpeg", "ffmpeg.exe")
  },
}