/* SkipToMenu.js */

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
  }

  createMenuItem (className) {
    const div = document.createElement('div');
    div.role = 'menuitem';
    div.tabindex = '-1';
    div.className = className;
    return div;
  }

  createMenuItemAnchor (dataId) {
    const a = document.createElement('a');
    a.setAttribute('data-skipto', dataId);
    a.href = '#';
    a.addEventListener('click', this.onMenuItemClicked);
    return a;
  }

  populateLandmarksGroup (landmarks) {
    const group = this.shadowRoot.querySelector('div[id="landmarks-group"]');

    landmarks.forEach(item => {
      const accessibleName = item.accessibleName;
      const div = this.createMenuItem('landmark');
      const a = this.createMenuItemAnchor(item.dataId);
      a.textContent = accessibleName ? `${item.ariaRole}: ${accessibleName}` : item.ariaRole;
      div.appendChild(a);
      group.appendChild(div);
    });
  }

  populateHeadingsGroup (headings) {
    const group = this.shadowRoot.querySelector('div[id="headings-group"]');
    const emptyContentMsg = `[empty text content]`;

    headings.forEach(item => {
      const div = this.createMenuItem('heading');
      const a = this.createMenuItemAnchor(item.dataId);
      a.textContent = item.content ? item.content : emptyContentMsg;
      div.appendChild(a);
      group.appendChild(div);
    });
  }

  // Use this setter to pass in menu data from external module
  set menuItems (data) {
    this.populateLandmarksGroup(data.landmarks);
    this.populateHeadingsGroup(data.headings);
  }

  // Note: This property must be set *before* setting menuItems
  set menuItemClickHandler (func) {
    this.onMenuItemClicked = func;
  }
}

export { SkipToMenu as default };
