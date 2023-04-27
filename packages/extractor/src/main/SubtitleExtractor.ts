import FFmpeg from "./utils/FFmpeg";

export default class SubtitleExtractor {

  private ffmpeg = new FFmpeg();

  getFileInfo(filePath: string) {
    return this.ffmpeg.getInfo(filePath);
  }

  genFileSub(filePath: string, subIdx: number, subPath: string) {
    return this.ffmpeg.genSub(filePath, subIdx, subPath);
  }
}