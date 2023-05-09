import XRegExp, {MatchArray} from "xregexp";

export default class RegexUtil {

  static findAll(regex: RegExp, input: string): MatchArray[] {
    const result: MatchArray[] = [];
    XRegExp.forEach(input, regex, (matchArray: MatchArray) => {
      result.push(matchArray)
    });
    return result;
  }
}