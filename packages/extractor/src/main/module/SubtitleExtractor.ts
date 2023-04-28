import {constants} from "common";
import SubInfo from "../domain/SubInfo";
import CommandExecutor from "./CommandExecutor";

export default class SubtitleExtractor {

  private executor = new CommandExecutor();
  private ffmpegPath: string = constants.path.ffmpeg;

  async healthCheck() {
    return this.executor.exec(`${this.ffmpegPath} -h`);
  }

  async genFileSub(videoPath: string, subIdx: number, subPath: string) {
    return this.executor.exec(`${this.ffmpegPath} -i "${videoPath}" -map 0:s:${subIdx} "${subPath}"`);
  }

  async getFileInfo(videoPath: string): Promise<SubInfo[]> {
    const { stderr: rawStr } = await this.getInfoString(videoPath);

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

  private async getInfoString(videoPath: string) {
    return this.executor.exec(`"${this.ffmpegPath}" -i "${videoPath}"`);
  }
}