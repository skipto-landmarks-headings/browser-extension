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

function onError(error) {
  console.log(`Error: ${error}`);
}

/*
**  Once menu data is available, display SkipTo menu
*/
function displayMenu (headings) {
  // logHeadings();

  function logHeadings () {
    if (headings.length === 0) {
      console.log('No headings found!');
      return;
    }

    console.log(`length: ${headings.length}`);

    headings.forEach(function (item) {
      console.log(`${item.tag}: ${item.content}`);
    });
  }

  // Define SkipTo menu as web component

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
    }

    connectedCallback () {
      // Add menu items to 'ul' container
      const shadowRoot = this.shadowRoot;
      const ul = shadowRoot.querySelector('ul');

      headings.forEach(function (item) {
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
  }   // end class SkipToMenu

  // Define the 'skipto-menu' custom element as deriving its
  // structure and behavior from a SkipToMenu class instance
  customElements.define('skipto-menu', SkipToMenu);

}   // end displayMenu

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
