import {Injectable} from '@angular/core';
import {Moment} from 'moment';

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
  OFF = 6
}


export interface Logger {

  error: (msg: string, ...extraParams: any) => void;
  warn: (msg: string, ...extraParams: any) => void;
  info: (msg: string, ...extraParams: any) => void;
  debug: (msg: string, ...extraParams: any) => void;
  trace: (msg: string, ...extraParams: any) => void;
}

export interface LogEntry {
  level: LogLevel;
  timestamp: Moment;
  message: string;
}


@Injectable()
export class LogService {
  log(msg: any) {
    console.log(new Date() + ": "
      + JSON.stringify(msg));
  }
}



export class ConsoleLogger implements Logger {

  level: LogLevel = LogLevel.DEBUG;
  writer: Logger = console;


  log(level: LogLevel, msg: string, ...extraParams: any) {

    if (this.level <= level) {
      console.log(msg);
    }
  }


  error(msg: string, ...extraParams: any) {
    if (this.level <= LogLevel.ERROR) {
      this.writer.error(msg);
    }
  };

  warn(msg: string) {
    if (this.level <= LogLevel.WARN) {
      console.warn(msg);
    }
  };

  info(msg: string) {
    if (this.level <= LogLevel.INFO) {
      console.info(msg);
    }
  };

  debug(msg: string) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(msg);
    }
  };

  trace(msg: string) {
    if (this.level <= LogLevel.TRACE) {
      console.trace(msg);
    }
  };
}
