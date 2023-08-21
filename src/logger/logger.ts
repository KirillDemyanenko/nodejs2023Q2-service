import { LoggerService } from "@nestjs/common";
import { Colors } from "../constants";

export class LibraryLogger implements LoggerService {
  private addDate(message: string) {
    return `[${new Date(Date.now()).toLocaleString()}] - `.concat(message);
  }

  private colorize(message: string, color: Colors) {
    switch (color) {
      case Colors.green: {
        return `\x1b[33m ${message} \x1b[0m`;
      }
      case Colors.blue: {
        return `\x1b[34m ${message} \x1b[0m`;
      }
      case Colors.red: {
        return `\x1b[31m ${message} \x1b[0m`;
      }
      case Colors.yellow: {
        return `\x1b[33m ${message} \x1b[0m`;
      }
      default: {
        return `\x1b[37m ${message} \x1b[0m`;
      }
    }
  }
  log(message: string, ...optionalParams: any[]) {
    console.log(this.colorize(this.addDate(message), Colors.green));
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(this.colorize(this.addDate(message), Colors.red));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.colorize(this.addDate(message), Colors.yellow));
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.log(this.colorize(this.addDate(message), Colors.white));
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log(this.colorize(this.addDate(message), Colors.blue));
  }
}
