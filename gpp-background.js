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
#ifdef FIREFOX
  browser.runtime.sendMessage(message);
#endif
#ifdef CHROME
  chrome.runtime.sendMessage(message);
#endif
  storageChanged = false;
}

function getStorageHandler (message, sender) {
  if (message.id === 'getStorage') {
    sendStorage();
  }
}

#ifdef FIREFOX
browser.runtime.onMessage.addListener(getStorageHandler);
#endif
#ifdef CHROME
chrome.runtime.onMessage.addListener(getStorageHandler);
#endif

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
#ifdef FIREFOX
  browser.storage.sync.get(null)
  .then(copyKeyValuePairs, onError);
#endif
#ifdef CHROME
  chrome.storage.sync.get(null, function (options) {
    if (notLastError()) { copyKeyValuePairs(options) }
  });
#endif
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

#ifdef FIREFOX
browser.storage.onChanged.addListener(onChangedHandler);
#endif
#ifdef CHROME
chrome.storage.onChanged.addListener(onChangedHandler)
#endif

/* ---------------------------------------------------------------- */
#ifdef FIREFOX
function onError (error) {
  console.log(`Error: ${error}`);
}
#endif
#ifdef CHROME
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
#endif
