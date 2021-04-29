/* MenuGroup.js */

const landmarksGrp = document.createElement('template');
landmarksGrp.innerHTML = `
    <div role="group" id="landmarks-group" aria-labelledby="landmarks-label">
    </div>
`;

class LandmarksGroup extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'menu.css');
    this.shadowRoot.appendChild(link);

    this.shadowRoot.appendChild(landmarksGrp.content.cloneNode(true));
    this.onMenuitemClicked = defaultClickHandler;
  }

  createMenuitem (className, dataId) {
    const div = document.createElement('div');
    div.role = 'menuitem';
    div.tabindex = '-1';
    div.className = className;
    div.setAttribute('data-skipto', dataId);
    div.addEventListener('click', this.onMenuitemClicked);
    return div;
  }

  // Use this setter to pass in menu data from external module
  set menuitems (landmarksInfo) {
    console.log('in landmarksGroup');
    const group = this.shadowRoot.querySelector('div[role="group"]')
    for (const info of landmarksInfo) {
      const div = this.createMenuitem('landmark', info.dataId);

      if (info.ariaRole === 'main') {
        div.classList.add('main');
      }

      const a = document.createElement('a');
      a.href = '#';

      const roleSpan = document.createElement('span');
      roleSpan.className = 'role';
      roleSpan.textContent = info.ariaRole;
      a.appendChild(roleSpan);

      if (info.accessibleName) {
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = info.accessibleName;
        a.appendChild(nameSpan);
      }

      div.appendChild(a);
      group.appendChild(div);
    }
  }

  // Note: This property must be set *before* setting menuitems
  set menuitemClickHandler (func) {
    this.onMenuitemClicked = func;
  }
}

const headingsGrp = document.createElement('template');
headingsGrp.innerHTML = `
    <div role="group" id="headings-group" aria-labelledby="headings-label">
    </div>
`;

class HeadingsGroup extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'menu.css');
    this.shadowRoot.appendChild(link);

    this.shadowRoot.appendChild(headingsGrp.content.cloneNode(true));
    this.onMenuitemClicked = defaultClickHandler;
  }

  createMenuitem (className, dataId) {
    const div = document.createElement('div');
    div.role = 'menuitem';
    div.tabindex = '-1';
    div.className = className;
    div.setAttribute('data-skipto', dataId);
    div.addEventListener('click', this.onMenuitemClicked);
    return div;
  }

  // Use this setter to pass in menu data from external module
  set menuitems (headingsInfo) {
    console.log('in headingsGroup');
    const group = this.shadowRoot.querySelector('div[role="group"]');
    const emptyContentMsg = '[empty text content]';
    for (const info of headingsInfo) {
      const div = this.createMenuitem('heading', info.dataId);
      if (info.tagName === 'h1') { div.classList.add('h1') }

      const a = document.createElement('a');
      a.href = '#';

      const textSpan = document.createElement('span');
      textSpan.className = 'text';
      textSpan.classList.add(info.tagName);
      textSpan.textContent = info.content ? info.content : emptyContentMsg;
      a.appendChild(textSpan);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = info.tagName;
      a.appendChild(nameSpan);

      div.appendChild(a);
      group.appendChild(div);
    }
  }

  // Note: This property must be set *before* setting menuitems
  set menuitemClickHandler (func) {
    this.onMenuitemClicked = func;
  }
}

function defaultClickHandler (evt) {
  console.log(evt.currentTarget.getAttribute('data-skipto'));
}

customElements.define('landmarks-group', LandmarksGroup);
customElements.define('headings-group', HeadingsGroup);
export { LandmarksGroup, HeadingsGroup };
