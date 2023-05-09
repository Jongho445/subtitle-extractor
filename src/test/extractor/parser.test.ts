import {it} from "@jest/globals";
import path from "path";
import constants from "../../main/common/constants";
import FFmpegExecutor from "../../main/extractor/parser/FFmpegExecutor";
import FFmpegParser from "../../main/extractor/parser/FFmpegParser";

it("parser test", async () => {
  const assetPath = path.join(constants.path.root, "src", "test", "extractor", "asset")
  const videoPath = path.join(assetPath, "video1.mkv");

  const executor = new FFmpegExecutor();
  const parser = new FFmpegParser();
  const execResult = await executor.getInfoString(videoPath);
  const result = parser.getSubInfos(execResult.getText());

  console.log(result);
})