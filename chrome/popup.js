/* popup.js */

import SkipToMenu from './SkipToMenu.js';
import { LandmarksGroup, HeadingsGroup } from './MenuGroup.js';
import { KbdEventMgr } from './KbdEventMgr.js';
import { getOptions } from './storage.js';

const skipToMenu     = document.querySelector('skipto-menu');
const landmarksGroup = document.querySelector('landmarks-group');
const headingsGroup  = document.querySelector('headings-group');

customElements.define('landmarks-group', LandmarksGroup);
customElements.define('headings-group', HeadingsGroup);

const numGroups = 2;
var groupsCompleted = 0;
var showLevelsOption;
var kbdEventMgr;
var contentPort;
var debug = false;

/*
**  Set up listener/handler for contentPort
*/
chrome.runtime.onConnect.addListener(connectionHandler);

function connectionHandler (port) {
  if (debug) console.log(`port.name: ${port.name}`);
  contentPort = port;
  contentPort.onMessage.addListener(portMessageHandler);
  getOptions().then(initProcessing);
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
getActiveTab().then(tab => checkProtocol(tab));

function checkProtocol (tab) {
  if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
    chrome.scripting.executeScript( { target: { tabId: tab.id }, files: ['domUtils.js'] } );
    chrome.scripting.executeScript( { target: { tabId: tab.id }, files: ['content.js'] } );
  }
  else {
    console.log('Invalid protocol: ', tab.url);
  }
}

/*
**  Initiate processing in content script
*/
function initProcessing (options) {
  console.log('initProcessing: ', options);
  showLevelsOption = options.showLevels;
  contentPort.postMessage({ id: 'storage', options: options });
}

/*
**  groupStatus: listen for completion of MenuGroup components
*/
function groupStatus (evt) {
  console.log(`${evt.type}: ${evt.detail}`);
  groupsCompleted++;
  if (groupsCompleted === numGroups) {
    displayMenu();
  }
}

/*
**  Consume menudata sent by content script
*/
function constructMenu (message) {
  landmarksGroup.menuitemClickHandler = sendSkipToData;
  headingsGroup.menuitemClickHandler  = sendSkipToData;

  landmarksGroup.addEventListener('status', groupStatus);
  headingsGroup.addEventListener('status', groupStatus);

  landmarksGroup.menudata = message.landmarks;
  headingsGroup.menudata  = message.headings;
}

/*
**  MenuGroup components are built: display SkipTo menu
*/
function displayMenu () {
  headingsGroup.showLevels = showLevelsOption;
  customElements.define('skipto-menu', SkipToMenu);

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
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        if (notLastError()) { resolve(tabs[0]) }
      });
  });
}

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

window.addEventListener('unload', evt => {
  if (debug) console.log('popup unloaded');
  skipToMenu.removeGroups();
  contentPort.postMessage({ id: 'cleanup' });
});
