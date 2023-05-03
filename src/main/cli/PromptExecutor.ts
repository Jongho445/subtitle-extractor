import {Answers} from "./types";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import {Stats} from "fs";
import constants from "../common/constants";
import FileUtil from "../common/FileUtil";
import SubtitleExtractor from "../extractor/module/SubtitleExtractor";
import SubInfo from "../extractor/domain/SubInfo";

export default class PromptExecutor {

  private readonly extractor = new SubtitleExtractor();
  private pathStats: Stats | null = null;
  public fileNames: string[] = [];
  public filePaths: string[] = [];
  public infosList: SubInfo[][] = [];

  runPrompt() {
    return inquirer.prompt([
      this.getInputQuestion(),
      this.getListQuestion()
    ]);
  }

  private getInputQuestion() {
    const self = this;
    return {
      type: "input",
      name: "path",
      message: "input path",
      default: constants.path.default.inputPath,
      async validate(input: any): Promise<boolean | string> {
        try {
          self.pathStats = await fs.stat(input);
        } catch (e: any) {
          return "is not path";
        }
        return true;
      }
    };
  }

  private getListQuestion() {
    const self = this;
    return {
      type: "list",
      name: "subtitle",
      message: "choice subtitle",
      choices: async (answers: Answers) => {
        self.fileNames = await fs
          .readdir(answers.path)
          .then(fileNames => fileNames.filter(fileName => {
            const ext = FileUtil.getExt(fileName);
            return constants.support.video.includes(ext);
          }));
        self.filePaths = self.fileNames.map(filename => path.resolve(answers.path, filename))
        self.infosList = await this.getInfosList(self.filePaths);

        return self.infosList[0].map(info => info.subIdx + ":" + info.title);
      }
    }
  }

  private async getInfosList(filePaths: string[]): Promise<SubInfo[][]> {
    const infosList: SubInfo[][] = [];
    if (filePaths.length === 0) {
      throw Error("not found files!");
    }
    else if (filePaths.length === 1) {
      infosList.push(await this.extractor.getFileInfo(filePaths[0]));
    }
    else {
      for (const filePath of filePaths) {
        infosList.push(await this.extractor.getFileInfo(filePath));
      }

      this.checkInfosList(infosList);
    }

    return infosList;
  }

  private checkInfosList(infosList: SubInfo[][]) {
    for (let i = 1; i <infosList.length; i++) {
      if (infosList[i - 1].length !== infosList[i].length) throw Error("not equals!");

      for (let j = 0; j < infosList[i].length; j++) {
        if (!infosList[i - 1][j].equals(infosList[i][j])) throw Error("not equals!");
      }
    }
  }
}