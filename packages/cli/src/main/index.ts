import fs from "fs-extra";
import {SubtitleExtractor, SubInfo} from "extractor";
import inquirer from "inquirer";
import {Stats} from "fs";
import {constants} from "common";
import path from "path";

interface State {
  fileStats: Stats | null,
  infos: SubInfo[] | null
}

interface Answers {
  path: string,
  subtitle: string
}

async function main() {
  const extractor = new SubtitleExtractor();
  const state: State = {
    fileStats: null,
    infos: null
  };

  const result = await inquirer.prompt([
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
        const infos = await extractor.getFileInfo(answers.path);
        state.infos = infos;

        return infos.map(info => info.subIdx + ":" + info.title);
      }
    }
  ]);

  const answers = result as Answers;
  const subtitle = answers.subtitle;

  const subIdx = Number(subtitle.split(":")[0]);

  fs.ensureDir(constants.path.result);
  const subFile = path.resolve(constants.path.result, "out.ass");

  await extractor.genFileSub(answers.path, subIdx, subFile);
}

main();
