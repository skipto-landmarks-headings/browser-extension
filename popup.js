/* popup.js */

/*
*   Set up listener for the message from the content script
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
*   Run the content script to extract data from active tab
*/
browser.tabs.executeScript( { file: 'content.js' } );

function onError(error) {
  console.log(`Error: ${error}`);
}

/*
*   Once the data is available, display the SkipTo menu
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

  // Define the SkipTo menu as a web component

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
      // Add the menu items to 'ul' container
      const shadowRoot = this.shadowRoot;
      const ul = shadowRoot.querySelector('ul');

      headings.forEach(function (item) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('data-skipto', item.dataId);
        a.textContent = item.content;
        a.href = '#';
        a.addEventListener('click', sendSkipToData);
        li.appendChild(a);
        ul.appendChild(li);
      });
    }

    disconnectedCallback() {
      // Clear the menu items (not sure if this is necessary or beneficial)
      const shadowRoot = this.shadowRoot;
      const ul = shadowRoot.querySelector('ul');

      while (ul.lastChild) {
        ul.removeChild(ul.lastChild);
      }
    }
  }   // end class SkipToMenu

  // Instantiate SkipToMenu by attaching it to 'skipto-menu' custom element
  customElements.define('skipto-menu', SkipToMenu);

}   // end displayMenu

/*
*   When a menu item is activated, notify the content script
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
