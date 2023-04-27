import {SubtitleExtractor} from "extractor";
import inquirer from "inquirer";
import fs from "fs-extra";
import {constants} from "common";
import path from "path";
import {State, Answers} from "./types";

export default class CliManager {

  private readonly extractor = new SubtitleExtractor();

  async run() {
    const state: State = {
      fileStats: null,
      infos: null
    };

    const result = await this.runPrompt(state);
    const answers = result as Answers;

    const subIdx = Number(answers.subtitle.split(":")[0]);

    await fs.ensureDir(constants.path.result);
    const subFile = path.resolve(constants.path.result, "out.ass");

    await this.extractor.genFileSub(answers.path, subIdx, subFile);
  }

  private runPrompt(state: State) {
    return inquirer.prompt([
      {
        type: "input",
        name: "path",
        message: "input path",
        async validate(answers: any): Promise<boolean | string> {
          try {
            state.fileStats = await fs.stat(answers);
          } catch (e: any) {
            return "is not path";
          }
          return true;
        }
      },
      {
        type: "list",
        name: "subtitle",
        message: "choice subtitle",
        choices: async (answers: Answers) => {
          const infos = await this.extractor.getFileInfo(answers.path);
          state.infos = infos;

          return infos.map(info => info.subIdx + ":" + info.title);
        }
      }
    ]);
  }
}