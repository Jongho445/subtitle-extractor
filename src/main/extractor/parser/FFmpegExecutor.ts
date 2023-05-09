import {exec} from "node:child_process";
import ExecResult from "./ExecResult";
import constants from "../../common/constants";

export default class FFmpegExecutor {

  private ffmpegPath: string = constants.path.ffmpeg;

  async healthCheck(): Promise<ExecResult> {
    return this.exec(`"${this.ffmpegPath}" -h`);
  }

  async genFileSub(videoPath: string, subIdx: number, subPath: string): Promise<ExecResult> {
    const cmd = `"${this.ffmpegPath}" -i "${videoPath}" -map 0:${subIdx} "${subPath}"`;
    return this.exec(cmd);
  }

  async getInfoString(videoPath: string): Promise<ExecResult> {
    const cmd = `"${this.ffmpegPath}" -i "${videoPath}"`;
    return this.exec(cmd);
  }

  private exec(cmd: string): Promise<ExecResult> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        const execResult = new ExecResult(error, stdout, stderr)
        resolve(execResult);
      });
    });
  }
}