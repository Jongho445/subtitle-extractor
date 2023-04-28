import {Answers, ResultInfo} from "../types";
import inquirer from "inquirer";
import {constants} from "common";
import fs from "fs-extra";
import path from "path";
import {SubInfo, SubtitleExtractor} from "extractor";
import {Stats} from "fs";

export default class PromptExecutor {

  private readonly extractor = new SubtitleExtractor();
  private pathStats: Stats | null = null;
  private fileNames: string[] = [];
  private filePaths: string[] = [];
  private infosList: SubInfo[][] = [];

  async runPrompt() {
    const result = await inquirer.prompt([
      this.getInputQuestion(),
      this.getListQuestion()
    ]);

    const answers = result as Answers;

    const subIdx = Number(answers.subtitle.split(":")[0]);
    return this.getResultInfos(this.fileNames, this.filePaths, this.infosList, subIdx);
  }

  private getResultInfos(fileNames: string[], filePaths: string[], infosList: SubInfo[][], subIdx: number): ResultInfo[] {
    const resultInfos: ResultInfo[] = [];
    for (let i = 0; i < fileNames.length; i++) {
      const fileNameWithoutExt = fileNames[i].split(".")[0];
      const ext = infosList[i][subIdx].ext;
      const subFileName = fileNameWithoutExt + "." + ext;
      const subFilePath = path.resolve(constants.path.default.outputPath, subFileName);

      resultInfos.push({
        videoFilePath: filePaths[i],
        subFilePath,
        subIdx
      });
    }
    return resultInfos;
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
        self.fileNames = await fs.readdir(answers.path);
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