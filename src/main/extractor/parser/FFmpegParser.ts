import {MatchArray} from "xregexp";
import SubInfo from "../domain/SubInfo";
import RawStreamData from "../domain/RawStreamData";
import RegexUtil from "../../common/RegexUtil";

export default class FFmpegParser {

  getSubInfos(fullRawString: string): SubInfo[] {
    // Stream #0:4(eng): Subtitle: ass (default)
    const regex = /stream.*#\d*:(\d*).*?:(.*?):(.*?)$/gim
    const streamHeaderMatches = RegexUtil.findAll(regex, fullRawString);
    return this
      .getRawStreamDataList(fullRawString, streamHeaderMatches)
      .filter(stream => stream.isTypeOf("subtitle"))
      .map(subtitleStream => SubInfo.of(subtitleStream));
  }

  private getRawStreamDataList(fullRawString: string, streamHeaderMatches: MatchArray[]): RawStreamData[] {
    const result: RawStreamData[] = [];

    for (let i = 0; i < streamHeaderMatches.length - 1; i++) {
      const curMatch = streamHeaderMatches[i];
      const nextMatch = streamHeaderMatches[i + 1];

      const streamRawString = fullRawString.substring(
        this.getIndexOf(curMatch),
        this.getIndexOf(nextMatch)
      )
      result.push(this.toRawStreamData(curMatch, streamRawString));
    }

    const lastMatchArray = streamHeaderMatches[streamHeaderMatches.length - 1]
    const lastStreamRawString = fullRawString.substring(
      this.getIndexOf(lastMatchArray),
      fullRawString.length
    );
    const lastRawStreamData = this.toRawStreamData(lastMatchArray, lastStreamRawString);
    result.push(lastRawStreamData);

    return result;
  }

  private getIndexOf(matchArray: MatchArray): number {
    const index = matchArray.index;
    if (index === undefined) {
      console.log("MatchArray's index is null. MatchArray is")
      console.log(matchArray);
      throw Error("MatchArray's index is null");
    } else {
      return index;
    }
  }

  private toRawStreamData(matchArray: MatchArray, streamRawString: string) {
    return new RawStreamData(
        Number(matchArray[1].trim()),
        matchArray[2].trim(),
        matchArray[3].trim(),
        matchArray[0].trim(),
        streamRawString.trim()
      )
  }
}