// Author: Filip 'Filomaster' Majorek
// Description: This is my private library, used across all my new projects
//              Basically it's a set of some very useful methods like better logging or generating random int
// Last edited: 25.04.2021

// const color = require("supports-color");
import sc from "supports-color";

// States
let OUT_LVL = 0; // Which logs will be printed
let PRETTY_LENGTH = 20; // Wrap message if longer than this value
let COLOR = false; // Control variable to check if terminal supports ascii color escape codes

//#region  Formatting, private methods
/**
 * This function format seconds, minutes or hours, adding 0 in the beginning if they are lower than 10
 * @param {number} time - seconds, minutes or hour number
 * @returns formatted time string
 */
let formatTime = (time) => (time < 10 ? "0" + time : time);
/**
 * This function format information section of message as following:
 * (color)0 HH:MM:SS [caller (| status)]
 * @param {string} caller - function which calls formattedMessage
 * @param {string} color - [optional] message color in ascii color escape code, please use predefined colors
 * @param {*} status - [optional] second part of the info, indicate type of message
 * @returns formatted string with information section
 */
let formattedMessage = (caller, color = "", status = null) => {
  let time = new Date();
  let out =
    (COLOR ? color : "") +
    formatTime(time.getHours()) +
    ":" +
    formatTime(time.getMinutes()) +
    ":" +
    formatTime(time.getSeconds()) +
    ` [${caller}` +
    (status != null ? ` | ${status}` : "") +
    "]  -  ";
  return out;
};
/**
 * This function parse arguments from array provided to function, stringify object and returns human readable message
 * @param {...any} args - any list of arguments
 * @returns human readable message
 */
let parseArguments = (args) => {
  let output = "";
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] == "object") {
      let string = JSON.stringify(args[i]);
      string = string.length > PRETTY_LENGTH ? JSON.stringify(args[i], null, 2) : string;
      output += "\n" + string + ", ";
    } else output += args[i] + (args.length > 1 ? ", " : " ");
  }
  return output;
};
//#endregion

// Main module

export const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};
// All methods related to output
export const out = {
  /**
   * This method prints provided arguments as debug level message
   * @param  {...any} message - Any provided arguments
   */
  debug: (...message) => {
    if (OUT_LVL <= 0) console.log(formattedMessage("DEBUG", "\x1b[37m") + parseArguments(message));
  },
  /**
   * This method prints provided arguments as info level message
   * @param  {...any} message - Any provided arguments
   */
  info: (...message) => {
    if (OUT_LVL <= 1)
      console.log(
        formattedMessage("INFO", "\x1b[34m") + parseArguments(message) + (COLOR ? "\x1b[0m" : "")
      );
  },
  /**
   * This method prints provided arguments as warning level message
   * @param  {...any} message - Any provided arguments
   */
  warn: (...message) => {
    if (OUT_LVL <= 2)
      console.log(
        formattedMessage("WARN", "\x1b[33m") + parseArguments(message) + (COLOR ? "\x1b[0m" : "")
      );
  },
  /**
   * This method prints provided arguments as error level message
   * @param  {...any} message - Any provided arguments
   */
  error: (...message) => {
    if (OUT_LVL <= 3)
      console.log(
        formattedMessage("ERROR", "\x1b[31m") + parseArguments(message) + (COLOR ? "\x1b[0m" : "")
      );
  },
  /**
   * This method prints message with customized color and prompt. *Both* params are required
   * @param {color} color - utils.color ascii escape code
   * @param {string} title - title to prompt
   * @param  {...any} message - Any provided argument
   */
  print: (color = "\x1b[37m", title = "OUT", ...message) => {
    console.log(
      formattedMessage(title, color) + parseArguments(message) + (COLOR ? "\x1b[0m" : "")
    );
  },
  /**
   * This method prints message with customized color and prompt. *All first 3* params are required
   * @param {color} color - utils.color ascii escape code
   * @param {string} title - title to prompt
   * @param {string} status - status of the message, "info" by default
   * @param  {...any} message - Any provided argument
   */
  printStatus: (color = "\x1b[37m", title = "OUT", status = "INFO", ...message) => {
    console.log(
      formattedMessage(title, color, status) + parseArguments(message) + (COLOR ? "\x1b[0m" : "")
    );
  },
  /**
   * This method clear previous line
   */
  clearLastLine: () => {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
  },
  /**
   * This method clear current line
   */
  clearCurrentLine: () => {
    process.stdout.clearLine(-1);
    process.stdout.cursorTo(0);
  },
  /**
   * This method sets log level
   * @param {*} level
   * 0 - debug |
   * 1 - info |
   * 2 - warn |
   * 3 - error
   */
  setOutputLevel: (level) => (OUT_LVL = level),
  checkColors: () => {
    if (sc.stdout) {
      COLOR = true;
    }
  },
};
// Method for generating random int. I've already used it in previous projects.
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// export { getRandomInt, out, colors };
