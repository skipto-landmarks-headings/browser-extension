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
browser.runtime.onMessage.addListener(messageHandler);

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
browser.runtime.sendMessage({ id: 'getStorage' });

/*
**  Initiate processing in content script
*/
function initProcessing (options) {
  console.log('initProcessing: ', options);

  const message = {
    id: 'procpage',
    data: options
  };

  browser.tabs.executeScript( { file: 'domUtils.js' } )
  .then(browser.tabs.executeScript( { file: 'content.js' } ))
  .then(sendToContentScript(message));
}

/*
browser.tabs.query({
  currentWindow: true,
  active: true
}).then(checkProtocol).catch(onError);

function checkProtocol (tabs) {
  for (const tab of tabs) {
    if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
      browser.tabs.executeScript( { file: 'domUtils.js' } );
      browser.tabs.executeScript( { file: 'content.js' } );
    }
    else {
      console.log('Invalid protocol: ', tab.url);
    }
  }
}
*/

/*
**  Consume menudata sent by content script
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
**  MenuGroup components are built: display SkipTo menu
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

  function sendMessageToTab (tab) {
    const message = {
      id: 'skipto',
      data: dataId
    };

    browser.tabs.sendMessage(tab.id, message)
    .then(response => closeUpShop())
    .catch(onError);
  }

  getActiveTab().then(sendMessageToTab);
}

/*
**  Helper Functions
*/
function sendToContentScript (message) {
  getActiveTab()
  .then((tab) => browser.tabs.sendMessage(tab.id, message))
  .catch(onError);
}

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
