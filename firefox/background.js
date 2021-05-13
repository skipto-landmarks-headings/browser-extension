/* background.js */

const storageCache = {};

const defaultOptions = {
  maxLevelIndex: 1,
  mainOnly: false
};

var storageChanged = false;

function sendStorage () {
  const message = {
    id: 'storage',
    options: storageCache,
    changed: storageChanged
  };
  browser.runtime.sendMessage(message);
  storageChanged = false;
}

function getStorageHandler (message, sender) {
  if (message.id === 'getStorage') {
    sendStorage();
  }
}

browser.runtime.onMessage.addListener(getStorageHandler);

/* ---------------------------------------------------------------- */
function updateStorageCache () {
  function copyKeyValuePairs (options) {
    if (Object.entries(options).length) {
      Object.assign(storageCache, options)
    }
    else {
      Object.assign(storageCache, defaultOptions)
    }
  }
  browser.storage.sync.get(null)
  .then(copyKeyValuePairs, onError);
  console.log('updateStorageCache: ', storageCache);
}

updateStorageCache();

/* ---------------------------------------------------------------- */
function onChangedHandler (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
    storageCache[key] = newValue;
  }
  storageChanged = true;
  console.log('onChangedHandler: ', storageChanged);
}

browser.storage.onChanged.addListener(onChangedHandler);

/* ---------------------------------------------------------------- */
function onError (error) {
  console.log(`Error: ${error}`);
}
