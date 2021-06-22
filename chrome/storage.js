/* storage.js */

export const defaultOptions = {
  maxLevelIndex: 1,
  mainOnly: false,
  showLevels: true
};

/*
**  getOptions
*/
export function getOptions () {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.get(function (options) {
      if (notLastError()) {
        if (Object.entries(options).length > 0) {
          resolve(options);
        }
        else {
          saveOptions(defaultOptions)
          resolve(defaultOptions);
        }
      }
    });
  });
}

/*
**  saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.set(options, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
**  logOptions
*/
export function logOptions (context, objName, obj) {
  let output = [];
  for (const prop in obj) {
    output.push(`${prop}: '${obj[prop]}'`);
  }
  console.log(`${context} > ${objName} > ${output.join(', ')}`);
}

/*
**  clearStorage: Used for testing
*/
export function clearStorage () {
  chrome.storage.sync.clear();
}

// Redefine console for Chrome extension
var console = chrome.extension.getBackgroundPage().console;

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
