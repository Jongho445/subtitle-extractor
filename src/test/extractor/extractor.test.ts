import {it} from "@jest/globals";
import path from "path";
import SubtitleExtractor from "../../main/extractor/SubtitleExtractor";
import constants from "../../main/common/constants";

it("test", async () => {
  const assetPath = path.join(constants.path.root, "src", "test", "extractor", "asset")
  const videoPath = path.join(assetPath, "video.mkv");
  const subPath = path.join(assetPath, "result.ass");

  const ffmpeg = new SubtitleExtractor();
  const infos = await ffmpeg.getFileInfo(videoPath);
  const result = await ffmpeg.genFileSub(videoPath, 0, subPath);
  console.log(infos);
});
