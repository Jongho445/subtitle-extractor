export default class FileUtil {

  static getExt(fileName: string) {
    const chunks = fileName.split(".");
    return chunks[chunks.length - 1];
  }
}