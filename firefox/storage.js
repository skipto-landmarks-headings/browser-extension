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
  return new Promise (function (resolve, reject) {
    let promise = browser.storage.sync.get();
    promise.then(
      options => {
        if (Object.entries(options).length > 0) {
          resolve(options);
        }
        else {
          saveOptions(defaultOptions);
          resolve(defaultOptions);
        }
      },
      message => { reject(new Error(`getOptions: ${message}`)) }
    );
  });
}

/*
**  saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
    let promise = browser.storage.sync.set(options);
    promise.then(
      () => { resolve() },
      message => { reject(new Error(`saveOptions: ${message}`)) }
    );
  });
}

/*
**  clearStorage: Used for testing
*/
export function clearStorage () {
  browser.storage.sync.clear();
}

