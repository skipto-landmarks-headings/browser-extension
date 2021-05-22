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

    // Use external CSS stylesheet
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'menu.css');
    this.shadowRoot.appendChild(link);

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.menuDiv = this.shadowRoot.querySelector('div[role="menu"]');
  }

  connectedCallback () {
    // Initialize child element references
    this.groups = this.querySelectorAll('landmarks-group, headings-group');
  }

  checkForEmptyGroups () {
    for (const group of this.groups) {
      if (group.infoCount === 0) {
        group.message.style.display = 'block';
      }
    }
  }

  get menuitems () {
    const menuitems = [];
    for (const group of this.groups) {
      menuitems.push(...group.menuitems);
    }
    return menuitems;
  }

  removeGroups () {
    for (const group of this.groups) {
      group.remove();
    }
  }
}

export { SkipToMenu as default };
