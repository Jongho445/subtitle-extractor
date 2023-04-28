import {ExecResult} from "../types";
import {exec} from "node:child_process";

export default class CommandExecutor {

  exec(cmd: string): Promise<ExecResult> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr });
      });
    });
  }
}