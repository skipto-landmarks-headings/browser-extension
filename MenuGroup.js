/* MenuGroup.js */

const emptyContentMsg = '[empty text content]';
const template = document.createElement('template');
template.innerHTML = `
    <div role="separator">
      <slot name="label">group label</slot>
    </div>
    <div role="group"></div>
    <div class="message">
      <slot name="empty">empty message</slot>
    </div>
`;

class MenuGroup extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({mode: 'open'});

    // Use external CSS stylesheet
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'menugroup.css');
    this.shadowRoot.appendChild(link);

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Initialize references
    this.groupDiv = this.shadowRoot.querySelector('div[role="group"]');
    this.labelDiv = this.shadowRoot.querySelector('div[role="separator"]');
    this.message  = this.shadowRoot.querySelector('div[class="message"]');

    this.onMenuitemClicked =
      evt => console.log(evt.currentTarget.getAttribute('data-skipto'));
  }

  set attributes (labelId) {
    this.labelDiv.setAttribute('id', labelId)
    this.groupDiv.setAttribute('aria-labelledby', labelId);
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

  disconnectedCallback () {
    console.log(`${this.constructor.name} disconnected`);
  }
}

class LandmarksGroup extends MenuGroup {
  constructor () {
    super();
    this.attributes = 'landmarks-label';
  }

  get menuitems () {
    return this.shadowRoot.querySelectorAll('div[role="menuitem"]');
  }

  // Use this setter to pass in menu data from external module
  set menudata (landmarksInfo) {
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

      this.groupDiv.appendChild(div);
    }

    this.infoCount = landmarksInfo.length;
  }
}

class HeadingsGroup extends MenuGroup {
  constructor () {
    super();
    this.attributes = 'headings-label';
  }

  get menuitems () {
    return this.shadowRoot.querySelectorAll('div[role="menuitem"]');
  }

  // Use this setter to pass in menu data from external module
  set menudata (headingsInfo) {
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

      this.groupDiv.appendChild(div);
    }

    this.infoCount = headingsInfo.length;
  }
}

export { LandmarksGroup, HeadingsGroup };
