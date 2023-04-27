import {Stats} from "fs";
import {SubInfo} from "extractor";

export interface State {
  fileStats: Stats | null,
  infos: SubInfo[] | null
}

export interface Answers {
  path: string,
  subtitle: string
}
