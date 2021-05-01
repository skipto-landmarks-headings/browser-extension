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
    case 'menudata':
      constructMenu({
        landmarks: message.landmarks,
        headings: message.headings
      });
      break;
  }
}

/*
**  Run content script to extract menu data from active tab
*/
#ifdef FIREFOX
browser.tabs.executeScript( { file: 'domUtils.js' } );
browser.tabs.executeScript( { file: 'content.js' } );
#endif
#ifdef CHROME
chrome.tabs.executeScript( { file: 'domUtils.js' } );
chrome.tabs.executeScript( { file: 'content.js' } );
#endif

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
  skipToMenu.landmarksGroup.menuitems = data.landmarks;
  skipToMenu.headingsGroup.menuitems = data.headings;
}

/*
**  Once menu data is available, display SkipTo menu
*/
function displayMenu () {
  const skipToMenu = document.querySelector('skipto-menu');
  kbdEventMgr = new KbdEventMgr(skipToMenu.menuitems, sendSkipToData);
  kbdEventMgr.setFocusFirstItem();
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
    for (let tab of tabs) {
      browser.tabs.sendMessage(tab.id, message)
      .then(response => closeUpShop())
      .catch(onError);
    }
#endif
#ifdef CHROME
    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, message);
    }
    closeUpShop();
#endif
  }

#ifdef FIREFOX
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs).catch(onError);
#endif
#ifdef CHROME
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (tabs) {
    if (notLastError()) { sendMessageToTabs(tabs) }
  });
#endif
}

#ifdef FIREFOX
function onError (error) {
  console.log(`Error: ${error}`);
}
#endif
#ifdef CHROME
// Redefine console for Chrome extension
// var console = chrome.extension.getBackgroundPage().console;

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
#endif
