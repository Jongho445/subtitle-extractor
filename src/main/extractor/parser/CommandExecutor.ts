import {exec} from "node:child_process";
import ExecResult from "./ExecResult";

export default class CommandExecutor {

  exec(cmd: string): Promise<ExecResult> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        const execResult = new ExecResult(error, stdout, stderr)
        resolve(execResult);
      });
    });
  }
}