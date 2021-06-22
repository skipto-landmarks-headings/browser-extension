/* background.js */

import { getOptions } from './storage.js';

function sendStorage (options) {
  const message = {
    id: 'storage',
    options: options
  };
  browser.runtime.sendMessage(message);
}

function getStorageHandler (message, sender) {
  if (message.id === 'getStorage') {
    getOptions().then(sendStorage);
  }
}

browser.runtime.onMessage.addListener(getStorageHandler);

/* ---------------------------------------------------------------- */

function onError (error) {
  console.log(`Error: ${error}`);
}
