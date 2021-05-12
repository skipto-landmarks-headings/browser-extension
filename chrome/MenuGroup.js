/* MenuGroup.js */

const emptyContentMsg = '[empty text content]';
const template = document.createElement('template');
template.innerHTML = `<div role="group"></div>`;

class MenuGroup extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({mode: 'open'});

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'menuitem.css');
    this.shadowRoot.appendChild(link);

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.group = this.shadowRoot.querySelector('div[role="group"]');

    this.onMenuitemClicked =
      evt => console.log(evt.currentTarget.getAttribute('data-skipto'));
  }

  set attributes (obj) {
    this.setAttribute('aria-labelledby', obj.labelId);
  }

  // Note: This property must be set *before* creating menuitems
  set menuitemClickHandler (func) {
    this.onMenuitemClicked = func;
  }

  createMenuitem (className, dataId) {
    const div = document.createElement('div');
    div.className = className;
    div.setAttribute('data-skipto', dataId);
    div.setAttribute('role', 'menuitem');
    div.tabindex = '-1';
    div.addEventListener('click', this.onMenuitemClicked);
    return div;
  }

  dispatchCustomEvent (eventName) {
    let count = this.group.querySelectorAll('div[role="menuitem"]').length;
    this.dispatchEvent(new CustomEvent(eventName, { detail: count }));
  }

  disconnectedCallback () {
    console.log(`${this.constructor.name} disconnected`);
  }
}

class LandmarksGroup extends MenuGroup {
  constructor () {
    super();
    this.attributes = { labelId: 'landmarks-label' };
  }

  get menuitems () {
    return this.shadowRoot.querySelectorAll('div[role="menuitem"]');
  }

  // Use this setter to pass in menu data from external module
  set menudata (landmarksInfo) {
    if (this.menuitems.length) return;

    for (const info of landmarksInfo) {
      const div = this.createMenuitem('landmark', info.dataId);
      if (info.ariaRole === 'main') {
        div.classList.add('main');
      }
      div.nav = info.ariaRole.substring(0, 1); // m, n or s

      const roleSpan = document.createElement('span');
      roleSpan.className = 'role';
      roleSpan.textContent = info.ariaRole;
      div.appendChild(roleSpan);

      if (info.accessibleName) {
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = info.accessibleName;
        div.appendChild(nameSpan);
      }

      this.group.appendChild(div);
    }

    this.infoCount = landmarksInfo.length;
    this.dispatchCustomEvent('landmarks');
  }
}

class HeadingsGroup extends MenuGroup {
  constructor () {
    super();
    this.attributes = { labelId: 'headings-label' };
  }

  get menuitems () {
    return this.shadowRoot.querySelectorAll('div[role="menuitem"]');
  }

  // Use this setter to pass in menu data from external module
  set menudata (headingsInfo) {
    if (this.menuitems.length) return;

    for (const info of headingsInfo) {
      const div = this.createMenuitem('heading', info.dataId);
      if (info.tagName === 'h1') { div.classList.add('h1') }
      div.nav = info.tagName.substring(1); // heading level

      const textSpan = document.createElement('span');
      textSpan.className = 'text';
      textSpan.classList.add(info.tagName);
      textSpan.textContent = info.content ? info.content : emptyContentMsg;
      div.appendChild(textSpan);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = info.tagName;
      div.appendChild(nameSpan);

      this.group.appendChild(div);
    }

    this.infoCount = headingsInfo.length;
    this.dispatchCustomEvent('headings');
  }
}

export { LandmarksGroup, HeadingsGroup };
