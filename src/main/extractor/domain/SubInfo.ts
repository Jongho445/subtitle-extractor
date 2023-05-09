import RawStreamData from "./RawStreamData";
import logger from "../../common/logger";

export default class SubInfo {

  constructor(
    readonly streamIdx: number,
    readonly ext: string,
    readonly title: string | null,
    readonly rawStreamData: RawStreamData,
  ) {}

  static of(rawStreamData: RawStreamData) {
    const ext = rawStreamData
      .description
      .replace("(default)", "")
      .trim()

    const title = rawStreamData.getTitle();

    if (title == null) {
      const errorMessage = `title is null, header is ${rawStreamData.headerRawString}`;
      logger.warning(errorMessage);
      logger.warning(rawStreamData.streamRawString, true);
    }

    return new SubInfo(
      rawStreamData.streamIndex,
      ext,
      title,
      rawStreamData
    )
  }

  equals(subInfo: SubInfo) {
    if (subInfo.title !== this.title) {
      logger.warning(`SubInfo's title is not equals!, ${this.title}, ${subInfo.title}`);
    }

    if (subInfo.streamIdx !== this.streamIdx) return false;
    else if (subInfo.ext !== this.ext) return false;
    else return true;
  }
}