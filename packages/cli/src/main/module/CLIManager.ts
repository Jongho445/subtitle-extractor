import {SubtitleExtractor} from "extractor";
import fs from "fs-extra";
import {constants} from "common";
import PromptExecutor from "./PromptExecutor";

export default class CLIManager {

  private readonly extractor = new SubtitleExtractor();

  async run() {
    const promptManager = new PromptExecutor();
    const resultInfos = await promptManager.runPrompt();

    await fs.ensureDir(constants.path.default.outputPath);

    for (const resultInfo of resultInfos) {
      const {videoFilePath, subIdx, subFilePath} = resultInfo;
      await this.extractor.genFileSub(videoFilePath, subIdx, subFilePath);
    }
  }
}
