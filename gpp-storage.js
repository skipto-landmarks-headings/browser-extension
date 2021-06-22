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
#ifdef FIREFOX
    let promise = browser.storage.sync.get();
    promise.then(
      options => {
        if (Object.entries(options).length === numOptions) {
          resolve(options);
        }
        else {
          const optionsWithDefaults = getDefaults(options);
          saveOptions(optionsWithDefaults);
          resolve(optionsWithDefaults);
        }
      },
      message => { reject(new Error(`getOptions: ${message}`)) }
    );
#endif
#ifdef CHROME
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
#endif
  });
}

/*
**  saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
#ifdef FIREFOX
    let promise = browser.storage.sync.set(options);
    promise.then(
      () => { resolve() },
      message => { reject(new Error(`saveOptions: ${message}`)) }
    );
#endif
#ifdef CHROME
    chrome.storage.sync.set(options, function () {
      if (notLastError()) { resolve() }
    });
#endif
  });
}

/*
**  clearStorage: Used for testing
*/
export function clearStorage () {
#ifdef FIREFOX
  browser.storage.sync.clear();
#endif
#ifdef CHROME
  chrome.storage.sync.clear();
#endif
}

#ifdef CHROME
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
#endif
