/* popup.js */

var emptyContentMsg = `[empty text content]`;

/*
**  Set up listener/handler for message from content script
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
**  Run content script to extract data from active tab
*/
browser.tabs.executeScript( { file: 'content.js' } );

function onError(error) {
  console.log(`Error: ${error}`);
}

/*
**  Once data is available, display SkipTo menu
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
      // After the following, 'shadowRoot' is retrievable as a property of 'this'
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

  // Instantiate SkipToMenu by attaching it to 'skipto-menu' custom element
  customElements.define('skipto-menu', SkipToMenu);

}   // end displayMenu

/*
**  When a menu item is activated, send message to content script
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
