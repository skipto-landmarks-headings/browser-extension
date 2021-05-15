/* popup.js */

import SkipToMenu from './SkipToMenu.js';
import { LandmarksGroup, HeadingsGroup } from './MenuGroup.js';
import { KbdEventMgr } from './KbdEventMgr.js';

customElements.define('skipto-menu', SkipToMenu);
const skipToMenu = document.querySelector('skipto-menu');

customElements.define('landmarks-group', LandmarksGroup);
const landmarksGroup = document.querySelector('landmarks-group');

customElements.define('headings-group', HeadingsGroup);
const headingsGroup = document.querySelector('headings-group');

var kbdEventMgr;
var contentPort;
var debug = false;

/*
**  Set up listener/handler for contentPort
*/
browser.runtime.onConnect.addListener(connectionHandler);

function connectionHandler (port) {
  if (debug) console.log(`port.name: ${port.name}`);
  contentPort = port;
  contentPort.onMessage.addListener(portMessageHandler);

  // Set up listener/handler for message from background
  browser.runtime.onMessage.addListener(messageHandler);
  function messageHandler (message, sender) {
    if (message.id === 'storage') {
      if (debug) console.log(`popup: 'storage' message`);
      initProcessing(message);
    }
  }

  // Request storage options from background script
  browser.runtime.sendMessage({ id: 'getStorage' });
}

function portMessageHandler (message) {
  switch (message.id) {
    case 'menudata':
      constructMenu(message);
      break;
  }
}

/*
** Run content scripts if active tab protocol allows
*/
getActiveTab().then(checkProtocol).catch(onError);

function checkProtocol (tab) {
  if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
    browser.tabs.executeScript( { file: 'domUtils.js' } );
    browser.tabs.executeScript( { file: 'content.js' } );
  }
  else {
    console.log('Invalid protocol: ', tab.url);
  }
}

/*
**  Initiate processing in content script
*/
function initProcessing (message) {
  console.log('initProcessing: ', message);
  contentPort.postMessage(message);
}

/*
**  Set up event handler indicating SkipToMenu is ready
*/
function skipToMenuEventHandler (evt) {
  if (debug) console.log(`${evt.type}: ${evt.detail}`);
  displayMenu();
}

/*
**  Consume menudata sent by content script
*/
function constructMenu (message) {
  skipToMenu.addEventListener('skipto-menu', skipToMenuEventHandler);

  landmarksGroup.menuitemClickHandler = sendSkipToData;
  headingsGroup.menuitemClickHandler = sendSkipToData;

  landmarksGroup.menudata = message.landmarks;
  headingsGroup.menudata = message.headings;
}

/*
**  MenuGroup components are built: display SkipTo menu
*/
function displayMenu () {
  skipToMenu.removeEventListener('skipto-menu', skipToMenuEventHandler);
  skipToMenu.checkGroupCounts();

  const menuitems = skipToMenu.menuitems;
  console.log(`menuitems: ${menuitems.length}`);

  if (menuitems.length) {
    kbdEventMgr = new KbdEventMgr(menuitems, sendSkipToData);
    skipToMenu.menuDiv.addEventListener('focus', evt =>
      kbdEventMgr.setFocusCurrentItem());
    kbdEventMgr.setFocusFirstItem();
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

  const message = {
    id: 'skipto',
    dataId: dataId
  };

  function closeUpShop () {
    const skipToMenu = document.querySelector('skipto-menu');
    skipToMenu.removeGroups();
    window.close();
  }

  contentPort.postMessage(message);
  closeUpShop();
}

/*
**  Helper Functions
*/
function getActiveTab () {
  return new Promise (function (resolve, reject) {
    let promise = browser.tabs.query({ currentWindow: true, active: true });
    promise.then(
      tabs => { resolve(tabs[0]) },
      msg => { reject(new Error(`getActiveTab: ${msg}`)); }
    )
  });
}

// Generic error handler
function onError (error) {
  console.log(`Error: ${error}`);
}

window.addEventListener('unload', evt => {
  if (debug) console.log('popup unloaded');
  contentPort.postMessage({ id: 'cleanup' });
});
