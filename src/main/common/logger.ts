import colors from "colors";
class Logger {

  warning(message: any, isDetail: boolean = false) {
    console.log(this.getMessage("WARNING", colors.yellow, message, isDetail));
  }

  error(message: any, isDetail: boolean = false) {
    console.log(this.getMessage("ERROR", colors.red, message, isDetail));
  }

  private getMessage(keyword: string, color: (keyword: string) => string, message: string, isDetail: boolean) {
    const prefix = this.getPrefix(keyword, color, isDetail);
    let colorMessage = message;
    if (isDetail) {
      colorMessage = colors.gray(colorMessage);
    }
    return `${prefix} ${colorMessage}`;
  }

  private getPrefix(keyword: string, color: (keyword: string) => string, isDetail: boolean) {
    if (isDetail) {
      return colors.gray(keyword);
    } else {
      return color(keyword);
    }
  }
}

const logger = new Logger();

export default logger;
