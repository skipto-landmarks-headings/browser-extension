/* background.js */

const storageCache = {};

const defaultOptions = {
  maxLevelIndex: 1,
  mainOnly: false
};

function sendStorage () {
  const message = {
    id: 'storage',
    data: storageCache
  };
  chrome.runtime.sendMessage(message);
}

function getStorageHandler (message, sender, sendResponse) {
  if (message.id === 'getStorage') {
    sendStorage();
    console.log('getStorageHandler');
  }
}

chrome.runtime.onMessage.addListener(getStorageHandler);

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
  chrome.storage.sync.get(null, function (options) {
    if (notLastError()) { copyKeyValuePairs(options) }
  });
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
  console.log('onChangedHandler: ', storageCache);
}

chrome.storage.onChanged.addListener(onChangedHandler)

/* ---------------------------------------------------------------- */
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
