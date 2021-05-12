/* popup.js */

import SkipToMenu from './SkipToMenu.js';
customElements.define('skipto-menu', SkipToMenu);

import { LandmarksGroup, HeadingsGroup } from './MenuGroup.js';
customElements.define('landmarks-group', LandmarksGroup);
customElements.define('headings-group', HeadingsGroup);

import { KbdEventMgr } from './KbdEventMgr.js';
var kbdEventMgr;
var debug = false;

/*
**  Set up listener/handler for messages
*/
#ifdef FIREFOX
browser.runtime.onMessage.addListener(messageHandler);
#endif
#ifdef CHROME
chrome.runtime.onMessage.addListener(messageHandler);
#endif

function messageHandler (message, sender) {
  switch (message.id) {
    case 'content':
      if (debug) console.log(`popup: 'content' message`);
      break;
    case 'storage':
      if (debug) console.log(`popup: 'storage' message`);
      initProcessing(message.data);
      break;
    case 'menudata':
      constructMenu({
        landmarks: message.landmarks,
        headings: message.headings
      });
      break;
  }
}

/*
**  Request storage options from background script
*/
#ifdef FIREFOX
browser.runtime.sendMessage({ id: 'getStorage' });
#endif
#ifdef CHROME
chrome.runtime.sendMessage({ id: 'getStorage' });
#endif

/*
**  Initiate processing in content script
*/
function initProcessing (options) {
  console.log('initProcessing: ', options);

  const message = {
    id: 'procpage',
    data: options
  };

#ifdef FIREFOX
  let promise1 = browser.tabs.executeScript({ file: 'domUtils.js' });
  let promise2 = browser.tabs.executeScript({ file: 'content.js' });
#endif
#ifdef CHROME
  let promise1 = chrome.tabs.executeScript({ file: 'domUtils.js' });
  let promise2 = chrome.tabs.executeScript({ file: 'content.js' });
#endif
  Promise.all([promise1, promise2]).then(sendToContentScript(message));
}

/*
#ifdef FIREFOX
browser.tabs.query({
  currentWindow: true,
  active: true
}).then(checkProtocol).catch(onError);
#endif
#ifdef CHROME
chrome.tabs.query({ currentWindow: true, active: true },
  function (tabs) {
    if (notLastError()) { checkProtocol(tabs) }
  });
#endif

function checkProtocol (tabs) {
  for (const tab of tabs) {
    if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
#ifdef FIREFOX
      browser.tabs.executeScript( { file: 'domUtils.js' } );
      browser.tabs.executeScript( { file: 'content.js' } );
#endif
#ifdef CHROME
      chrome.tabs.executeScript( { file: 'domUtils.js' } );
      chrome.tabs.executeScript( { file: 'content.js' } );
#endif
    }
    else {
      console.log('Invalid protocol: ', tab.url);
    }
  }
}
*/

function landmarksEventHandler (evt) {
  if (debug) console.log('landmarks: ' + evt.detail);
}

function headingsEventHandler (evt) {
  if (debug) console.log('headings: ' + evt.detail);
  displayMenu();
}

/*
**  Consume menudata sent by content script
*/
function constructMenu (data) {
  const skipToMenu = document.querySelector('skipto-menu');

  skipToMenu.landmarksGroup.addEventListener('landmarks', landmarksEventHandler);
  skipToMenu.headingsGroup.addEventListener('headings', headingsEventHandler);

  skipToMenu.landmarksGroup.menuitemClickHandler = sendSkipToData;
  skipToMenu.headingsGroup.menuitemClickHandler = sendSkipToData;
  skipToMenu.landmarksGroup.menudata = data.landmarks;
  skipToMenu.headingsGroup.menudata = data.headings;
}

/*
**  MenuGroup components are built: display SkipTo menu
*/
function displayMenu () {
  const skipToMenu = document.querySelector('skipto-menu');
  skipToMenu.landmarksGroup.removeEventListener('landmarks', landmarksEventHandler);
  skipToMenu.headingsGroup.removeEventListener('headings', headingsEventHandler);
  skipToMenu.checkGroupCounts();

  const menuitems = skipToMenu.menuitems;
  if (menuitems.length) {
    kbdEventMgr = new KbdEventMgr(menuitems, sendSkipToData);
    kbdEventMgr.setFocusFirstItem();

    const menuNode = skipToMenu.shadowRoot.querySelector('div[role="menu"]');
    menuNode.addEventListener('focus', evt => kbdEventMgr.setFocusCurrentItem());
  }
}

/*
** When a menu item is activated, send a message containing the
** value of its 'data-skipto' attribute to the content script
*/
function sendSkipToData (evt) {
  let dataId = evt.currentTarget.getAttribute('data-skipto');
  evt.stopPropagation();
  evt.preventDefault();

  function closeUpShop () {
    const skipToMenu = document.querySelector('skipto-menu');
    skipToMenu.removeGroups();
    window.close();
  }

  function sendMessageToTab (tab) {
    const message = {
      id: 'skipto',
      data: dataId
    };

#ifdef FIREFOX
    browser.tabs.sendMessage(tab.id, message)
    .then(response => closeUpShop())
    .catch(onError);
#endif
#ifdef CHROME
    chrome.tabs.sendMessage(tab.id, message);
    closeUpShop();
#endif
  }

  getActiveTab().then(sendMessageToTab);
}

/*
**  Helper Functions
*/
function sendToContentScript (message) {
  getActiveTab()
#ifdef FIREFOX
  .then((tab) => browser.tabs.sendMessage(tab.id, message))
  .catch(onError);
#endif
#ifdef CHROME
  .then((tab) => chrome.tabs.sendMessage(tab.id, message));
#endif
}

function getActiveTab () {
  return new Promise (function (resolve, reject) {
#ifdef FIREFOX
    let promise = browser.tabs.query({ currentWindow: true, active: true });
    promise.then(
      tabs => { resolve(tabs[0]) },
      msg => { reject(new Error(`getActiveTab: ${msg}`)); }
    )
#endif
#ifdef CHROME
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        if (notLastError()) { resolve(tabs[0]) }
      });
#endif
  });
}

// Generic error handler
#ifdef FIREFOX
function onError (error) {
  console.log(`Error: ${error}`);
}
#endif
#ifdef CHROME
var console = chrome.extension.getBackgroundPage().console;
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
#endif
