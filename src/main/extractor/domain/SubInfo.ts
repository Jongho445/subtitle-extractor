export default class SubInfo {

  constructor(
    readonly subIdx: number,
    readonly ext: string,
    readonly title: string,
    readonly rawStr: string
  ) {
  }

  equals(subInfo: SubInfo) {
    if (subInfo.subIdx !== this.subIdx) return false;
    else if (subInfo.ext !== this.ext) return false;
    else if (subInfo.title !== this.title) return false;
    else return true;
  }
}