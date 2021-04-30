/* SkipToMenu.js */

import KbdEventMgr from './KbdEventMgr.js';

const template = document.createElement('template');
template.innerHTML = `
  <div role="menu">
    <div role="separator" id="landmarks-label">
      <slot name="landmarks-label">group label</slot>
    </div>
    <div role="group" id="landmarks-group" aria-labelledby="landmarks-label">
    </div>
    <div role="separator" id="headings-label">
      <slot name="headings-label">group label</slot>
    </div>
    <div role="group" id="headings-group" aria-labelledby="headings-label">
    </div>
  </div>
`;

class SkipToMenu extends HTMLElement {
  constructor () {
    super();
    // After the following call to attachShadow, the 'shadowRoot'
    // element is retrievable as 'this.shadowRoot'
    this.attachShadow( { mode: "open" } );

    // Use an external CSS stylesheet for the component
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'menu.css');
    this.shadowRoot.appendChild(link);

    // Add menu container
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Add default handler for click event
    this.onMenuItemClicked =
      evt => console.log(evt.target.getAttribute('data-skipto'));

    // Initialize showLandmarks setting
    this._showLandmarks = true;
  }

  createMenuItem (className, dataId) {
    const div = document.createElement('div');
    div.role = 'menuitem';
    div.tabindex = '-1';
    div.className = className;
    div.setAttribute('data-skipto', dataId);
    div.addEventListener('click', this.onMenuItemClicked);
    return div;
  }

  populateLandmarksGroup (landmarks) {
    const group = this.shadowRoot.querySelector('div[id="landmarks-group"]');

    landmarks.forEach(item => {
      const div = this.createMenuItem('landmark', item.dataId);
      if (item.ariaRole === 'main') { div.classList.add('main') }
      const a = document.createElement('a');
      a.href = '#';

      const role = document.createElement('span');
      role.className = 'role';
      role.textContent = item.ariaRole;
      a.appendChild(role);

      if (item.accessibleName) {
        const name = document.createElement('span');
        name.className = 'name';
        name.textContent = item.accessibleName;
        a.appendChild(name);
      }

      div.appendChild(a);
      group.appendChild(div);
    });
  }

  populateHeadingsGroup (headings) {
    const group = this.shadowRoot.querySelector('div[id="headings-group"]');
    const emptyContentMsg = '[empty text content]';

    headings.forEach(item => {
      const div = this.createMenuItem('heading', item.dataId);
      if (item.tagName === 'h1') { div.classList.add('h1') }
      const a = document.createElement('a');
      a.href = '#';

      const text = document.createElement('span');
      text.className = 'text';
      text.classList.add(item.tagName);
      text.textContent = item.content ? item.content : emptyContentMsg;
      a.appendChild(text);

      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = item.tagName;
      a.appendChild(name);

      div.appendChild(a);
      group.appendChild(div);
    });
  }

  // Use this setter to pass in menu data from external module
  set menuItems (data) {
    if (this._showLandmarks) {
      this.populateLandmarksGroup(data.landmarks);
    }
    else {
      this.shadowRoot.querySelector('div[id="landmarks-label"]').style = "display: none";
    }
    this.populateHeadingsGroup(data.headings);

    // Instantiate KbdEventMgr object to manage keyboard events
    const menuNode = this.shadowRoot.querySelector('div[role="menu"]');
    this.kbdEventMgr = new KbdEventMgr(menuNode, this.onMenuItemClicked);
    this.kbdEventMgr.setFocusFirstItem();
  }

  // Note: This property must be set *before* setting menuItems
  set menuItemClickHandler (func) {
    this.onMenuItemClicked = func;
  }

  // Note: This property must be set *before* setting menuItems
  set showLandmarks (value) {
    this._showLandmarks = value;
  }
}

export { SkipToMenu as default };