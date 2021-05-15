/* SkipToMenu.js */

const template = document.createElement('template');
template.innerHTML = `
  <div role="menu" tabindex="-1">
    <slot name="group-one"></slot>
    <slot name="group-two"></slot>
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

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.menuDiv = this.shadowRoot.querySelector('div[role="menu"]');
    this.groupsCompleted = 0;
  }

  connectedCallback () {
    // Initialize child element references
    this.landmarksGroup = this.querySelector('landmarks-group');
    this.headingsGroup  = this.querySelector('headings-group');

    this.landmarksGroup.menuParent = this;
    this.headingsGroup.menuParent  = this;

    const groups = this.querySelectorAll('landmarks-group, headings-group');
    this.numGroups = groups.length;
  }

  checkGroupCounts () {
    if (this.landmarksGroup.infoCount === 0) {
      this.landmarksGroup.message.style.display = 'block';
    }
    if (this.headingsGroup.infoCount === 0) {
      this.headingsGroup.message.style.display = 'block';
    }
  }

  set completed (val) {
    if (val) this.groupsCompleted++;
    if (this.groupsCompleted === this.numGroups) {
      this.dispatchEvent(
        new CustomEvent('skipto-menu', { detail: 'ready' })
      );
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
