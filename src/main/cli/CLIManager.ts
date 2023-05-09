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

    const chunks = answers.subtitle.split(":");
    const listIdx = Number(chunks[0]);
    const streamIdx = Number(chunks[1]);
    const resultInfos = this.getResultInfos(promptExecutor, listIdx, streamIdx);

    await this.genSubFiles(resultInfos);
  }

  private getResultInfos(promptExecutor: PromptExecutor, listIdx: number, streamIdx: number): ResultInfo[] {
    const {fileNames, filePaths, selectList} = promptExecutor;
    const resultInfos: ResultInfo[] = [];
    for (let i = 0; i < fileNames.length; i++) {
      const fileNameWithoutExt = fileNames[i].split(".")[0];
      const ext = selectList[i][listIdx].ext;
      if (!constants.support.subtitle.includes(ext)) throw Error("this is not supported subtitle ext")

      const subFileName = fileNameWithoutExt + "." + ext;
      const subFilePath = path.resolve(constants.path.default.outputPath, subFileName);

      resultInfos.push({
        videoFilePath: filePaths[i],
        subFilePath,
        streamIdx
      });
    }
    return resultInfos;
  }

  private async genSubFiles(resultInfos: ResultInfo[]) {
    await fs.ensureDir(constants.path.default.outputPath);

    for (const resultInfo of resultInfos) {
      const {videoFilePath, streamIdx, subFilePath} = resultInfo;
      await this.extractor.genFileSub(videoFilePath, streamIdx, subFilePath);
    }
  }
}
