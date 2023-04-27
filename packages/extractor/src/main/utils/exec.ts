import {exec, ExecException} from "node:child_process";

interface ExecResult {
  error: ExecException | null,
  stdout: string,
  stderr: string
}

export default function(cmd: string): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}