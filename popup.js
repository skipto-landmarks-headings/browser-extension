/* popup.js */

browser.tabs.executeScript( { file: 'content.js' } );
browser.runtime.onMessage.addListener(messageHandler);

function messageHandler (message, sender) {
  switch (message.id) {
    case 'content':
      displayMenu(message.data);
      break;
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

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

  class SkipToMenu extends HTMLElement {
    constructor () {
      super();
      const shadowRoot = this.attachShadow( { mode: "open" } );
      const ul = document.createElement('ul');
      shadowRoot.appendChild(ul);

      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', 'menu.css');
      shadowRoot.appendChild(link);
    }

    connectedCallback () {
      addMenuItems(this);
    }

    disconnectedCallback() {
      clearMenuItems(this);
    }
  }

  customElements.define('skipto-menu', SkipToMenu);

  function addMenuItems (elem) {
    const shadow = elem.shadowRoot;
    const ul = shadow.querySelector('ul');
    headings.forEach(function (item) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('data-skipto', item.dataId);
      a.textContent = item.content;
      a.href = '#';
      a.addEventListener('click', (evt) => console.log(`click: ${evt.target.getAttribute('data-skipto')}`));
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function clearMenuItems (elem) {
    const shadow = elem.shadowRoot;
    const ul = shadow.querySelector('ul');
    while (ul.lastChild) {
      ul.removeChild(ul.lastChild);
    }
  }
}
