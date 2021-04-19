/* popup.js */

var emptyContentMsg = `[empty text content]`;

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
**  Define SkipToMenu class and register skipto-menu element
*/
class SkipToMenu extends HTMLElement {
  constructor () {
    super();
    // After the following call to attachShadow, the 'shadowRoot'
    // element is retrievable as 'this.shadowRoot'
    const shadowRoot = this.attachShadow( { mode: "open" } );

    // Use an external CSS stylesheet for the component
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'menu.css');
    shadowRoot.appendChild(link);

    // Add menu container as 'ul' element
    const ul = document.createElement('ul');
    shadowRoot.appendChild(ul);
    this._ul = ul;
  }

  set menuItems (data) {
    const ul = this._ul;
    data.forEach(function (item) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('data-skipto', item.dataId);
      a.textContent = item.content ? item.content : emptyContentMsg;
      a.href = '#';
      a.addEventListener('click', sendSkipToData);
      li.appendChild(a);
      ul.appendChild(li);
    });
  }
}

customElements.define('skipto-menu', SkipToMenu);

/*
**  Once menu data is available, display SkipTo menu
*/
function displayMenu (headings) {
  const skipToMenu = document.querySelector('skipto-menu');
  skipToMenu.menuItems = headings;
}

/*
**  When a menu item is activated, send a message containing the
**  value of its 'data-skipto' attribute to the content script
*/
function sendSkipToData (evt) {
  let data = evt.target.getAttribute('data-skipto');
  // console.log(`click: ${data}`);

  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs).catch(onError);

  function sendMessageToTabs (tabs) {
    const message = {
      id: 'popup',
      data: data
    };

    for (let tab of tabs) {
      browser.tabs.sendMessage(tab.id, message);
    }
  }
}
