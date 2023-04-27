import path from "path";

const rootPath = path.resolve(__dirname, "..", "..", "..", "..");

export default {
  path: {
    root: rootPath,
    result: path.resolve(rootPath, "result"),
    assets: path.resolve(rootPath, "assets"),
    ffmpeg: path.resolve(rootPath, "assets", "ffmpeg", "ffmpeg.exe")
  },
}
