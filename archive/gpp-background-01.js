/* background.js */

var debug = true;
var storageCache = {};

var defaultOptions = {
  maxLevelIndex: 1,
  mainOnly: false
};

#ifdef FIREFOX
browser.storage.onChanged.addListener(updateStorageCache);
#endif
#ifdef CHROME
chrome.storage.onChanged.addListener(updateStorageCache);
#endif

updateStorageCache();
if (Object.keys(storageCache).length === 0) {
  // initStorageCache();
}

/*
**  Set up listener/handler for messages from other scripts
*/
#ifdef FIREFOX
browser.runtime.onMessage.addListener(messageHandler);
#endif
#ifdef CHROME
chrome.runtime.onMessage.addListener(messageHandler);
#endif

function messageHandler (message, sender) {
  switch (message.id) {
    case 'options': // from background script
      console.log('background script received message: ', message);
      sendOptions();
      break;
  }
}

/* ---------------------------------------------------------------- */
function sendMessageToTabs (tabs, message) {
  for (const tab of tabs) {
#ifdef FIREFOX
    browser.tabs.sendMessage(tab.id, message);
#endif
#ifdef CHROME
    chrome.tabs.sendMessage(tab.id, message);
#endif
  }
}

/* ---------------------------------------------------------------- */
function sendOptions () {
  const message = {
    id: 'storage',
    data: storageCache
  }
#ifdef FIREFOX
  browser.tabs.query({ currentWindow: true, active: true })
  .then(tabs => sendMessageToTabs(tabs, message)).catch(onError);
#endif
#ifdef CHROME
  chrome.tabs.query({ currentWindow: true, active: true },
    function (tabs) {
      if (notLastError()) { sendMessageToTabs(tabs, message) }
    }
  );
#endif
}

/* ---------------------------------------------------------------- */
function updateStorageCache () {
#ifdef FIREFOX
  browser.storage.sync.get(null)
  .then(options => Object.assign(storageCache, options), onError);
#endif
#ifdef CHROME
  chrome.storage.sync.get(null, function (options) {
    if (notLastError()) { Object.assign(storageCache, options); }
  });
#endif
  if (debug) console.log('updateStorageCache: ', storageCache);
}

/* ---------------------------------------------------------------- */
function initStorageCache () {
#ifdef FIREFOX
  browser.storage.sync.set(defaultOptions);
#endif
#ifdef CHROME
  chrome.storage.sync.set(defaultOptions);
#endif
}

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
