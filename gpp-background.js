/* background.js */

import { getOptions } from './storage.js';

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
