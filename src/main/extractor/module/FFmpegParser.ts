import CommandExecutor from "./CommandExecutor";
import SubInfo from "../domain/SubInfo";
import constants from "../../common/constants";

export default class FFmpegParser {

  private executor = new CommandExecutor();
  private ffmpegPath: string = constants.path.ffmpeg;

  async healthCheck() {
    return this.executor.exec(`"${this.ffmpegPath}" -h`);
  }

  async genFileSub(videoPath: string, subIdx: number, subPath: string) {
    const cmd = `"${this.ffmpegPath}" -i "${videoPath}" -map 0:s:${subIdx} "${subPath}"`;
    return this.executor.exec(cmd);
  }

  async getInfoString(videoPath: string) {
    const cmd = `"${this.ffmpegPath}" -i "${videoPath}"`;
    return this.executor.exec(cmd);
  }

  getSubInfo(rawStr: string) {
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