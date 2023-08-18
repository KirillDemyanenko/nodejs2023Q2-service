import { LoggerService } from '@nestjs/common';
import { Colors } from '../constants';

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
    }
  }
  /**
   * Write a 'log' level log.
   */
  log(message: string, ...optionalParams: any[]) {
    console.log(this.colorize(this.addDate(message), Colors.green));
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.log(this.colorize(this.addDate(message), Colors.red));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(this.colorize(this.addDate(message), Colors.blue));
  }
}
