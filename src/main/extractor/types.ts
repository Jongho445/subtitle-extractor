import {ExecException} from "node:child_process";

export interface ExecResult {
  error: ExecException | null,
  stdout: string,
  stderr: string
}

