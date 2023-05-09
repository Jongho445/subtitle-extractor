import {it} from "@jest/globals";
import path from "path";
import SubtitleExtractor from "../../main/extractor/SubtitleExtractor";
import constants from "../../main/common/constants";

it("extractor test", async () => {
  const assetPath = path.join(constants.path.root, "src", "test", "extractor", "asset")
  const videoPath = path.join(assetPath, "video1.mkv");
  const subPath = path.join(assetPath, "result.ass");

  const extractor = new SubtitleExtractor();
  const infos = await extractor.getFileInfo(videoPath);
  const result = await extractor.genFileSub(videoPath, 0, subPath);
  console.log(infos);
});
