/* background.js */

import { getOptions, clearStorage } from './storage.js';

clearStorage();

function sendStorage (options) {
  const message = {
    id: 'storage',
    options: options
  };
  chrome.runtime.sendMessage(message);
}

function getStorageHandler (message, sender) {
  if (message.id === 'getStorage') {
    getOptions().then(sendStorage);
  }
}

chrome.runtime.onMessage.addListener(getStorageHandler);

/* ---------------------------------------------------------------- */

function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
