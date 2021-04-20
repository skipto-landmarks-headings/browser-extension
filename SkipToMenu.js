/* SkipToMenu.js */

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

    // Add default handler for click event
    this.onMenuItemClicked =
      evt => console.log(evt.target.getAttribute('data-skipto'));
  }

  set menuItems (data) {
    const ul = this._ul;
    const emptyContentMsg = `[empty text content]`;

    data.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('data-skipto', item.dataId);
      a.textContent = item.content ? item.content : emptyContentMsg;
      a.href = '#';
      a.addEventListener('click', this.onMenuItemClicked);
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  // Note: This property must be set *before* setting menuItems
  set menuItemClickHandler (func) {
    this.onMenuItemClicked = func;
  }
}

export { SkipToMenu as default };
