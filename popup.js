/* popup.js */

import SkipToMenu from './SkipToMenu.js';

/*
**  Register skipto-menu custom element
*/
customElements.define('skipto-menu', SkipToMenu);

/*
**  Set up listener/handler for message containing menu data
**  sent from content script
*/
browser.runtime.onMessage.addListener(messageHandler);

function messageHandler (message, sender) {
  switch (message.id) {
    case 'content':
      displayMenu(message.data);
      break;
  }
}

/*
**  Run content script to extract menu data from active tab
*/
browser.tabs.executeScript( { file: 'content.js' } );

/*
**  Once menu data is available, display SkipTo menu
*/
function displayMenu (headings) {
  const skipToMenu = document.querySelector('skipto-menu');
  skipToMenu.menuItemClickHandler = sendSkipToData;
  skipToMenu.menuItems = headings;
}

/*
** When a menu item is activated, send a message containing the
** value of its 'data-skipto' attribute to the content script
*/
function sendSkipToData (evt) {
  let data = evt.target.getAttribute('data-skipto');

  function sendMessageToTabs (tabs) {
    const message = {
      id: 'popup',
      data: data
    };

    for (let tab of tabs) {
      browser.tabs.sendMessage(tab.id, message);
    }
  }

  function onError (error) {
    console.log(`Error: ${error}`);
  }

  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs).catch(onError);
}
