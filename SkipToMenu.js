/* SkipToMenu.js */

import { LandmarksGroup, HeadingsGroup } from './MenuGroup.js';
import KbdEventMgr from './KbdEventMgr.js';

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

    // Add menu container
    this.menuContainer = this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Init group references
    this.landmarksGroup = this.shadowRoot.querySelector('landmarks-group');
    this.headingsGroup = this.shadowRoot.querySelector('headings-group');

    // Add default handler for click event
    this.onMenuItemClicked =
      evt => console.log(evt.target.getAttribute('data-skipto'));

    // Initialize showLandmarks setting
    this._showLandmarks = true;
  }

  // Use this setter to pass in menu data from external module
  set kbdEventHandlers (func) {
    this.kbdEventMgr = new KbdEventMgr(this.menuContainer, this.onMenuItemClicked);
  }

  // Note: This property must be set *before* setting menuItems
  set menuitemClickHandler (func) {
    this.onMenuItemClicked = func;
  }

  // Note: This property must be set *before* setting menuItems
  set showLandmarks (value) {
    this._showLandmarks = value;
  }
}

export { SkipToMenu as default };
