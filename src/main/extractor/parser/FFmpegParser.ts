import SubInfo from "../domain/SubInfo";
import XRegExp, {MatchArray} from "xregexp";

export default class FFmpegParser {

  getSubInfo(rawStr: string) {
    return rawStr
      .replace(/ /gi, "")
      .split("Stream#")
      .filter(chunk => chunk.includes("Subtitle:"))
      .map((chunk, index) =>
        new SubInfo(
          index,
          this.getExt(chunk),
          this.getTitle(chunk),
          chunk
        )
      );
  }

  private getExt(subInfo: string) {
    return subInfo
      .replace(/ /gi, "")
      .split("Subtitle:")[1]
      .split("\r\n")[0]
      .replace("(default)", "");
  }

  private getTitle(subInfo: string) {
    return subInfo
      .replace(/ /gi, "")
      .split("Metadata:")[1]
      .split("\r\n")
      .filter(chunk => chunk.includes("title:"))[0]
      .split(":")[1]
  }

  private findAllMatchArrays(regex: RegExp, input: string): MatchArray[] {
    const result: MatchArray[] = [];
    XRegExp.forEach(input, regex, (matchArray: MatchArray) => {
      result.push(matchArray)
    });
    return result;
  }
}