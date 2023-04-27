import exec from "./exec";
import {constants} from "common";
import {SubInfo} from "../types";

export default class FFmpeg {

  private ffmpegPath: string = constants.path.ffmpeg;

  async healthCheck() {
    return exec(`${this.ffmpegPath} -h`);
  }

  async genSub(videoPath: string, subIdx: number, subPath: string) {
    return exec(`${this.ffmpegPath} -i ${videoPath} -map 0:s:${subIdx} ${subPath}`);
  }

  async getInfo(videoPath: string): Promise<SubInfo[]> {
    const { stderr: rawStr } = await this.getInfoString(videoPath);

    return rawStr
      .replace(/ /gi, "")
      .split("Stream#")
      .filter(chunk => chunk.includes("Subtitle:"))
      .map((chunk, index) => ({
        subIdx: index,
        ext: this.getExt(chunk),
        title: this.getTitle(chunk),
        rawStr: chunk
      }));
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
    return exec(`${this.ffmpegPath} -i ${videoPath}`);
  }
}