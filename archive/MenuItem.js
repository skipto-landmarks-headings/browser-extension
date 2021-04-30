/* MenuItem.js */

const lmi = document.createElement('template');
lmi.innerHTML = `
  <menuitem class="landmark" role="menuitem" tabindex="-1">
    <span class="role"></span>
    <span class="name"></span>
  </menuitem>
`;

const hmi = document.createElement('template');
hmi.innerHTML = `
  <menuitem class="heading" role="menuitem" tabindex="-1">
    <span class="text"></span>
    <span class="name"></span>
  </menuitem>
`;

const template = document.createElement('template');
template.innerHTML = `
  <menuitem role="menuitem" tabindex="-1">
    <span></span>
    <span></span>
  </menuitem>
`;

class MenuItem extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
