import { LoggerService } from '@nestjs/common';
import { Colors } from '../constants';
import { appendFile, open, writeFile } from 'fs';
import { join } from 'path';

export class LibraryLogger implements LoggerService {
  path = join(process.cwd(), '/logs/log.txt');
  constructor() {
    open(this.path, 'r', (err) => {
      if (err) {
        writeFile(join(process.cwd(), '/logs/log.txt'), '', (err) => {
          if (err) console.log('File not created!');
        });
      }
    });
  }
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
  log(message: string) {
    const log = this.addDate(message);
    appendFile(
      join(process.cwd(), '/logs/log.txt'),
      log.concat('\n'),
      () => {},
    );
    console.log(this.colorize(log, Colors.green));
  }

  error(message: any) {
    const log = this.addDate(message);
    appendFile(
      join(process.cwd(), '/logs/log.txt'),
      log.concat('\n'),
      () => {},
    );
    console.log(this.colorize(log, Colors.red));
  }

  warn(message: any) {
    const log = this.addDate(message);
    writeFile(join(process.cwd(), '/logs/log.txt'), log.concat('\n'), () => {});
    console.log(this.colorize(log, Colors.yellow));
  }

  debug?(message: any) {
    const log = this.addDate(message);
    appendFile(
      join(process.cwd(), '/logs/log.txt'),
      log.concat('\n'),
      () => {},
    );
    console.log(this.colorize(log, Colors.white));
  }

  verbose?(message: any) {
    const log = this.addDate(message);
    appendFile(
      join(process.cwd(), '/logs/log.txt'),
      log.concat('\n'),
      () => {},
    );
    console.log(this.colorize(log, Colors.blue));
  }
}
