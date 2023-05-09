import fs from "fs-extra";
import PromptExecutor from "./PromptExecutor";
import {Answers, ResultInfo} from "./types";
import path from "path";
import constants from "../common/constants";
import SubtitleExtractor from "../extractor/SubtitleExtractor";

export default class CLIManager {

  private readonly extractor = new SubtitleExtractor();

  async run() {
    const promptExecutor = new PromptExecutor();
    const result = await promptExecutor.runPrompt();
    const answers = result as Answers;

    const subIdx = Number(answers.subtitle.split(":")[0]);
    const resultInfos = this.getResultInfos(promptExecutor, subIdx);

    await this.genSubFiles(resultInfos);
  }

  private getResultInfos(promptExecutor: PromptExecutor, subIdx: number): ResultInfo[] {
    const {fileNames, filePaths, infosList} = promptExecutor;
    const resultInfos: ResultInfo[] = [];
    for (let i = 0; i < fileNames.length; i++) {
      const fileNameWithoutExt = fileNames[i].split(".")[0];
      const ext = infosList[i][subIdx].ext;
      if (!constants.support.subtitle.includes(ext)) throw Error("this is not supported subtitle ext")

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

  private async genSubFiles(resultInfos: ResultInfo[]) {
    await fs.ensureDir(constants.path.default.outputPath);

    for (const resultInfo of resultInfos) {
      const {videoFilePath, subIdx, subFilePath} = resultInfo;
      await this.extractor.genFileSub(videoFilePath, subIdx, subFilePath);
    }
  }
}
