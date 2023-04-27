import {exec} from "node:child_process";
import {ExecResult} from "../types";

export default function(cmd: string): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}