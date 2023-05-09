import SubInfo from "./domain/SubInfo";
import constants from "../common/constants";
import FileUtil from "../common/FileUtil";
import FFmpegParser from "./parser/FFmpegParser";
import FFmpegExecutor from "./parser/FFmpegExecutor";

export default class SubtitleExtractor {

  private executor = new FFmpegExecutor();
  private parser = new FFmpegParser();

  isSupported(videoPath: string): boolean {
    return constants.support.video.includes(FileUtil.getExt(videoPath));
  }

  async getFileInfo(videoPath: string): Promise<SubInfo[]> {
    if (!this.isSupported(videoPath)) throw Error("this is not supported video file!");

    const execResult = await this.executor.getInfoString(videoPath);
    return this.parser.getSubInfo(execResult.getText());
  }

  async genFileSub(videoPath: string, subIdx: number, subPath: string) {
    if (!this.isSupported(videoPath)) throw Error("this is not supported video file!");
    return this.executor.genFileSub(videoPath, subIdx, subPath)
  }
}