/* popup.js */

import SkipToMenu from './SkipToMenu.js';
customElements.define('skipto-menu', SkipToMenu);

import { LandmarksGroup, HeadingsGroup } from './MenuGroup.js';
customElements.define('landmarks-group', LandmarksGroup);
customElements.define('headings-group', HeadingsGroup);

import { KbdEventMgr } from './KbdEventMgr.js';
var kbdEventMgr;

/*
**  Set up listener/handler for message containing menu data
**  sent from content script
*/
#ifdef FIREFOX
browser.runtime.onMessage.addListener(messageHandler);
#endif
#ifdef CHROME
chrome.runtime.onMessage.addListener(messageHandler);
#endif

function messageHandler (message, sender) {
  switch (message.id) {
    case 'cs-ready':
      console.log('popup script received message: ', message);
      sendStartMessage();
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
**  Run the content script to initialize data structures
*/
#ifdef FIREFOX
  browser.tabs.executeScript( {file: 'domUtils.js' });
  browser.tabs.executeScript( {file: 'content.js' });
#endif
#ifdef CHROME
  chrome.tabs.executeScript({ file: 'domUtils.js' });
  chrome.tabs.executeScript({ file: 'content.js' });
#endif

/*
**  Send message to content script to extract menu data from active tab
*/
function sendStartMessage () {
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
}

function checkProtocol (tabs) {
  for (const tab of tabs) {
    if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
#ifdef FIREFOX
      browser.tabs.sendMessage(tab.id, { id: 'procpage' });
#endif
#ifdef CHROME
      chrome.tabs.sendMessage(tab.id, { id: 'procpage' });
#endif
    }
    else {
      console.log('Invalid protocol: ', tab.url);
    }
  }
}

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

#ifdef FIREFOX
    for (const tab of tabs) {
      browser.tabs.sendMessage(tab.id, message)
      .then(response => closeUpShop())
      .catch(onError);
    }
#endif
#ifdef CHROME
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, message);
    }
    closeUpShop();
#endif
  }

#ifdef FIREFOX
  browser.tabs.query({ currentWindow: true, active: true })
  .then(sendMessageToTabs).catch(onError);
#endif
#ifdef CHROME
  chrome.tabs.query({ currentWindow: true, active: true },
    function (tabs) {
      if (notLastError()) { sendMessageToTabs(tabs) }
    }
  );
#endif
}

#ifdef FIREFOX
// Generic error handler
function onError (error) {
  console.log(`Error: ${error}`);
}
#endif
#ifdef CHROME
// Redefine console for Chrome extension
var console = chrome.extension.getBackgroundPage().console;

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
#endif