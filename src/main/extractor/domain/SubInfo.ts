import RawStreamData from "./RawStreamData";

export default class SubInfo {

  constructor(
    readonly subIdx: number,
    readonly ext: string,
    readonly title: string,
    readonly rawStreamData: RawStreamData,
  ) {}

  static of(rawStreamData: RawStreamData) {
    const ext = rawStreamData
      .description
      .replace("(default)", "")
      .trim()

    const title = rawStreamData.getTitle()

    if (title == null) throw Error(`title is null, header is ${rawStreamData.headerRawString}`)

    return new SubInfo(
      rawStreamData.streamIndex,
      ext,
      title,
      rawStreamData
    )
  }

  equals(subInfo: SubInfo) {
    if (subInfo.subIdx !== this.subIdx) return false;
    else if (subInfo.ext !== this.ext) return false;
    else if (subInfo.title !== this.title) return false;
    else return true;
  }
}