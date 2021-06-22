/* storage.js */

const defaultOptions = {
  maxLevelIndex: 1,
  mainOnly: false,
  showLevels: true
};

/*
**  getOptions
*/
export function getOptions () {
  const numOptions = Object.entries(defaultOptions).length;

  function getDefaults (options) {
    const copy = Object.assign({}, defaultOptions);
    return Object.assign(copy, options);
  }

  return new Promise (function (resolve, reject) {
    chrome.storage.sync.get(function (options) {
      if (notLastError()) {
        if (Object.entries(options).length === numOptions) {
          resolve(options);
        }
        else {
          const optionsWithDefaults = getDefaults(options);
          saveOptions(optionsWithDefaults);
          resolve(optionsWithDefaults);
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
