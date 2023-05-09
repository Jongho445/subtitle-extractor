import SubInfo from "../extractor/domain/SubInfo";

/**
 * 하나의 영상에 존재하는 subtitle list
 */
export type VideoSubSelect = SubInfo[]

export interface ResultInfo {
  videoFilePath: string,
  subFilePath: string,
  streamIdx: number,
}

export interface Answers {
  path: string,
  subtitle: string
}
