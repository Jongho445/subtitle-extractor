import {ExecException} from "node:child_process";

export default class ExecResult {

  constructor(
    readonly error: ExecException | null,
    readonly stdout: string,
    readonly stderr: string
  ) {}

  getText(): string {
    if (this.stdout !== "") {
      return this.stdout
    } else {
      return this.stderr
    }
  }
}