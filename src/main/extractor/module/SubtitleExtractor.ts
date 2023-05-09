import SubInfo from "../domain/SubInfo";
import constants from "../../common/constants";
import FileUtil from "../../common/FileUtil";
import FFmpegParser from "./FFmpegParser";

export default class SubtitleExtractor {

  private parser = new FFmpegParser();

  isSupported(videoPath: string): boolean {
    return constants.support.video.includes(FileUtil.getExt(videoPath));
  }

  async getFileInfo(videoPath: string): Promise<SubInfo[]> {
    if (!this.isSupported(videoPath)) throw Error("this is not supported video file!");

    const execResult = await this.parser.getInfoString(videoPath);
    return this.parser.getSubInfo(execResult.getText());
  }

  async genFileSub(videoPath: string, subIdx: number, subPath: string) {
    if (!this.isSupported(videoPath)) throw Error("this is not supported video file!");
    return this.parser.genFileSub(videoPath, subIdx, subPath)
  }
}