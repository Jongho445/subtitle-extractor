import {it} from "@jest/globals";
import path from "path";
import {constants} from "common";
import SubtitleExtractor from "../main/module/SubtitleExtractor";

it("test", async () => {
  const ffmpeg = new SubtitleExtractor();
  const videoPath = path.join(constants.path.assets, "video.mkv");
  const subPath = path.join(constants.path.assets, "result.ass");

  const infos = await ffmpeg.getFileInfo(videoPath);
  const result = await ffmpeg.genFileSub(videoPath, 0, subPath);
  console.log(infos);
});
