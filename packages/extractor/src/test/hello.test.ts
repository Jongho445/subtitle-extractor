import {it} from "@jest/globals";
import path from "path";
import constants from "../main/config/constants";
import FFmpeg from "../main/utils/FFmpeg";

it("test", async () => {
  const ffmpeg = new FFmpeg();
  const videoPath = path.join(constants.path.assets, "video.mkv");
  const subPath = path.join(constants.path.assets, "result.ass");

  const infos = await ffmpeg.getInfo(videoPath);
  const result = await ffmpeg.genSub(videoPath, 0, subPath);
  console.log(infos);
});
