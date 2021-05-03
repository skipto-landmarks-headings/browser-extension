/* SkipToMenu.js */

const template = document.createElement('template');
template.innerHTML = `
  <div role="menu">
    <div role="separator" id="landmarks-label">
      <slot name="landmarks-label">group label</slot>
    </div>
    <div class="message" id="landmarks-empty">
      <slot name="landmarks-empty">empty message</slot>
    </div>
    <landmarks-group></landmarks-group>
    <div role="separator" id="headings-label">
      <slot name="headings-label">group label</slot>
    </div>
    <div class="message" id="headings-empty">
      <slot name="headings-empty">empty message</slot>
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
    this.landmarksGroup   = this.shadowRoot.querySelector('landmarks-group');
    this.landmarksMessage = this.shadowRoot.querySelector('#landmarks-empty');

    this.headingsGroup    = this.shadowRoot.querySelector('headings-group');
    this.headingsMessage  = this.shadowRoot.querySelector('#headings-empty');
  }

  checkGroupCounts () {
    if (this.landmarksGroup.infoCount === 0) {
      this.landmarksMessage.style.display = 'block';
    }
    if (this.headingsGroup.infoCount === 0) {
      this.headingsMessage.style.display = 'block';
    }
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
