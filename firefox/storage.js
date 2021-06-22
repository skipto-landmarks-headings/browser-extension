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

