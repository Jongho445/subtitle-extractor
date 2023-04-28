import {constants} from "common";
import SubInfo from "../domain/SubInfo";
import CommandExecutor from "./CommandExecutor";
import FileUtil from "common/dist/main/FileUtil";

export default class SubtitleExtractor {

  private executor = new CommandExecutor();
  private ffmpegPath: string = constants.path.ffmpeg;

  async healthCheck() {
    return this.executor.exec(`${this.ffmpegPath} -h`);
  }

  isSupported(videoPath: string): boolean {
    return constants.support.video.includes(FileUtil.getExt(videoPath));
  }

  async genFileSub(videoPath: string, subIdx: number, subPath: string) {
    if (!this.isSupported(videoPath)) throw Error("this is not supported video file!");

    const cmd = `${this.ffmpegPath} -i "${videoPath}" -map 0:s:${subIdx} "${subPath}"`;
    return this.executor.exec(cmd);
  }

  async getFileInfo(videoPath: string): Promise<SubInfo[]> {
    if (!this.isSupported(videoPath)) throw Error("this is not supported video file!");

    const { stderr: rawStr } = await this.getInfoString(videoPath);
    return this.getSubInfo(rawStr);
  }

  private async getInfoString(videoPath: string) {
    const cmd = `"${this.ffmpegPath}" -i "${videoPath}"`;
    return this.executor.exec(cmd);
  }

  private getSubInfo(rawStr: string) {
    return rawStr
      .replace(/ /gi, "")
      .split("Stream#")
      .filter(chunk => chunk.includes("Subtitle:"))
      .map((chunk, index) =>
        new SubInfo(
          index,
          this.getExt(chunk),
          this.getTitle(chunk),
          chunk
        )
      );
  }

  private getExt(subInfo: string) {
    return subInfo
      .replace(/ /gi, "")
      .split("Subtitle:")[1]
      .split("\r\n")[0]
      .replace("(default)", "");
  }

  private getTitle(subInfo: string) {
    return subInfo
      .replace(/ /gi, "")
      .split("Metadata:")[1]
      .split("\r\n")
      .filter(chunk => chunk.includes("title:"))[0]
      .split(":")[1]
  }
}