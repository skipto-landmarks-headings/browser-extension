/* popup.js */

import SkipToMenu from './SkipToMenu.js';
customElements.define('skipto-menu', SkipToMenu);

import { LandmarksGroup, HeadingsGroup } from './MenuGroup.js';
customElements.define('landmarks-group', LandmarksGroup);
customElements.define('headings-group', HeadingsGroup);

import { KbdEventMgr } from './KbdEventMgr.js';
var kbdEventMgr;

/*
**  Set up listener/handler for messages
*/
chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler (message, sender) {
  switch (message.id) {
    case 'content':
      console.log(`popup: 'content' message`);
      break;
    case 'storage':
      console.log(`popup: 'storage' message`);
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
chrome.runtime.sendMessage({ id: 'getStorage' });

/*
**  Run content script
*/
function runContentScript () {
}

function initProcessing (options) {
  console.log('initProcessing: ', options);

  const message = {
    id: 'procpage',
    data: options
  };

  chrome.tabs.executeScript( { file: 'domUtils.js' },
  () => chrome.tabs.executeScript( { file: 'content.js' } ,
  () => sendToContentScript(message)));
}

/*
chrome.tabs.query({ currentWindow: true, active: true },
  function (tabs) {
    if (notLastError()) { checkProtocol(tabs) }
  });

function checkProtocol (tabs) {
  for (const tab of tabs) {
    if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
      chrome.tabs.executeScript( { file: 'domUtils.js' } );
      chrome.tabs.executeScript( { file: 'content.js' } );
    }
    else {
      console.log('Invalid protocol: ', tab.url);
    }
  }
}
*/

function constructMenu (data) {
  const skipToMenu = document.querySelector('skipto-menu');

  skipToMenu.landmarksGroup.addEventListener('landmarks',
    evt => console.log('landmarks: ' + evt.detail));

  skipToMenu.headingsGroup.addEventListener('headings',
    evt => {
      console.log('headings: ' + evt.detail);
      displayMenu(skipToMenu);
    });

  skipToMenu.landmarksGroup.menuitemClickHandler = sendSkipToData;
  skipToMenu.headingsGroup.menuitemClickHandler = sendSkipToData;
  skipToMenu.landmarksGroup.menudata = data.landmarks;
  skipToMenu.headingsGroup.menudata = data.headings;
}

/*
**  Once menu data is available, display SkipTo menu
*/
function displayMenu () {
  const skipToMenu = document.querySelector('skipto-menu');
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

  function sendMessageToTabs (tabs) {
    const message = {
      id: 'skipto',
      data: dataId
    };

    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, message);
    }
    closeUpShop();
  }

  chrome.tabs.query({ currentWindow: true, active: true },
    function (tabs) {
      if (notLastError()) { sendMessageToTabs(tabs) }
    }
  );
}

// Generic error handler
var console = chrome.extension.getBackgroundPage().console;
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

function sendToContentScript (message) {
  chrome.tabs.query({ active: true, currentWindow: true },
    function (tabs) {
      if (notLastError()) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    }
  );
}
