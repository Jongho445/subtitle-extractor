import {Answers, VideoSubSelect} from "./types";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import {Stats} from "fs";
import constants from "../common/constants";
import FileUtil from "../common/FileUtil";
import SubtitleExtractor from "../extractor/SubtitleExtractor";
import SubInfo from "../extractor/domain/SubInfo";
import logger from "../common/logger";

export default class PromptExecutor {

  private readonly extractor = new SubtitleExtractor();
  private pathStats: Stats | null = null;
  public fileNames: string[] = [];
  public filePaths: string[] = [];
  public selectList: VideoSubSelect[] = [];

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
        self.selectList = await this.getInfosList(self.filePaths);

        const fullFilledSelect: VideoSubSelect | undefined = self.selectList.find(originSelect => {
          const filteredSelect: VideoSubSelect = originSelect.filter(info => info.title !== null);
          return filteredSelect.length == originSelect.length;
        });

        if (fullFilledSelect === undefined) {
          throw Error("full filled select is not found!");
        }

        return fullFilledSelect.map((info: SubInfo, idx: number) => `${idx}:${info.streamIdx}:${info.title}`);
      }
    }
  }

  private async getInfosList(filePaths: string[]): Promise<VideoSubSelect[]> {
    const selectList: VideoSubSelect[] = [];

    if (filePaths.length === 0) {
      throw Error("not found files!");
    }
    else if (filePaths.length === 1) {
      selectList.push(await this.extractor.getFileInfo(filePaths[0]));
    }
    else {
      for (const filePath of filePaths) {
        selectList.push(await this.extractor.getFileInfo(filePath));
      }

      // 자막을 추출해야하는 파일들이 복수 존재하는 경우 동일성 체크를 진행한다
      this.checkEquals(selectList);
    }

    return selectList;
  }

  private checkEquals(selectList: VideoSubSelect[]) {
    for (let i = 1; i < selectList.length; i++) {
      const curSelect = selectList[i - 1];
      const nextSelect = selectList[i];

      // VideoSubSelect 내부 SubInfo의 개수 체크
      if (curSelect.length !== nextSelect.length) {
        logger.error(selectList);
        throw Error("selects size is not equals!");
      }

      // SubInfo 동일성 체크
      for (let j = 0; j < curSelect.length; j++) {
        if (!curSelect[j].equals(nextSelect[j])) {
          logger.error(selectList);
          throw Error("two SubInfo is not equals!");
        }
      }
    }
  }
}