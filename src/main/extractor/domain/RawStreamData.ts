export default class RawStreamData {

  constructor(
    readonly streamIndex: number,
    readonly type: string,
    readonly description: string,
    readonly headerRawString: string,
    readonly streamRawString: string
  ) {}

  isTypeOf(typeString: string) {
    const regex = new RegExp(typeString, "i")
    return this.type.match(regex)
  }

  getTitle(): string | null {
    const regex = /metadata:\s*?title.*?:(.*)$/im
    const result: RegExpExecArray | null = regex.exec(this.streamRawString)
    if (result === null) {
      return null;
    } else {
      return result[1].trim();
    }
  }
}