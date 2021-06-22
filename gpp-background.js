/* background.js */

import { getOptions, clearStorage } from './storage.js';

clearStorage();

function sendStorage (options) {
  const message = {
    id: 'storage',
    options: options
  };
#ifdef FIREFOX
  browser.runtime.sendMessage(message);
#endif
#ifdef CHROME
  chrome.runtime.sendMessage(message);
#endif
}

function getStorageHandler (message, sender) {
  if (message.id === 'getStorage') {
    getOptions().then(sendStorage);
  }
}

#ifdef FIREFOX
browser.runtime.onMessage.addListener(getStorageHandler);
#endif
#ifdef CHROME
chrome.runtime.onMessage.addListener(getStorageHandler);
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
