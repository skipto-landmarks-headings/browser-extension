/* SkipToMenu.js */

const template = document.createElement('template');
template.innerHTML = `
  <div role="menu">
    <div role="separator" id="landmarks-label">
      <slot name="landmarks-label">group label</slot>
    </div>
    <landmarks-group></landmarks-group>
    <div role="separator" id="headings-label">
      <slot name="headings-label">group label</slot>
    </div>
    <headings-group></headings-group>
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

    // Add menu container from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Init references
    this.menuNode       = this.shadowRoot.querySelector('div[role="menu"]');
    this.landmarksGroup = this.shadowRoot.querySelector('landmarks-group');
    this.headingsGroup  = this.shadowRoot.querySelector('headings-group');
  }

  get menuitems () {
    let menuitems = [];
    menuitems.push(...this.landmarksGroup.menuitems);
    menuitems.push(...this.headingsGroup.menuitems);
    return menuitems;
  }

  removeGroups () {
    this.landmarksGroup.remove();
    this.headingsGroup.remove();
  }
}

export { SkipToMenu as default };
