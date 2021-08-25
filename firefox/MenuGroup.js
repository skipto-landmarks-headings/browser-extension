/* MenuGroup.js */

import * as i18n from './i18n.js';
import getMessage from './i18n.js';

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
    this.attachShadow({ mode: 'open' });

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

  set labelText (str) {
    this.labelDiv.textContent = str;
  }

  set messageText (str) {
    this.message.textContent = str;
  }

  // Note: This property must be set *before* creating menuitems
  set menuitemClickHandler (func) {
    this.onMenuitemClicked = func;
  }

  set statusComplete (infoCount) {
    if (infoCount === 0) {
      this.message.style.display = 'block';
    }
    this.dispatchEvent(
      new CustomEvent('status',
        { detail: `${this.constructor.name} complete` })
    );
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

  get menuitems () {
    return this.shadowRoot.querySelectorAll('div[role="menuitem"]');
  }

  disconnectedCallback () {
    console.log(`${this.constructor.name} disconnected`);
  }
}

class LandmarksGroup extends MenuGroup {
  constructor () {
    super();
    this.attributes  = 'landmarks-label';
    this.labelText   = i18n.landmarksLabel;
    this.messageText = i18n.noLandmarksMsg;
  }

  // Use this setter to pass in menu data from external module
  set menudata (landmarksInfo) {
    for (const info of landmarksInfo) {
      const div = this.createMenuitem('landmark', info.dataId);
      div.nav = info.dataId.substring(0, 1); // m, s, n, a, c

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

    this.statusComplete = landmarksInfo.length;
  }
}

class HeadingsGroup extends MenuGroup {
  constructor () {
    super();
    this.attributes  = 'headings-label';
    this.labelText   = i18n.headingsLabel;
    this.messageText = i18n.noHeadingsMsg;
  }

  set showLevels (flag) {
    const docElem = document.documentElement;
    const show = [0, 'inline-block'];
    const hide = [1, 'none'];

    function setCustomProps (values) {
      const props = ['--col-offset', '--level-display']
      for (let i = 0; i < values.length; i++) {
        docElem.style.setProperty(props[i], values[i])
      }
    }

    setCustomProps(flag ? show : hide);
  }

  // Use this setter to pass in menu data from external module
  set menudata (headingsInfo) {
    for (const info of headingsInfo) {
      const div = this.createMenuitem('heading', info.dataId);
      const text = info.content ? info.content : i18n.emptyContent;
      const level = info.tagName.substring(1);
      const labelValue = getMessage('headingLevel', [text, level]);
      div.setAttribute('aria-label', labelValue);
      div.nav = level;

      const levelSpan = document.createElement('span');
      levelSpan.className = 'level';
      levelSpan.classList.add(info.tagName);
      levelSpan.textContent = level;
      div.appendChild(levelSpan);

      const textSpan = document.createElement('span');
      textSpan.className = 'text';
      textSpan.classList.add(info.tagName);
      textSpan.textContent = text;
      div.appendChild(textSpan);

      this.groupDiv.appendChild(div);
    }

    this.statusComplete = headingsInfo.length;
  }
}

export { LandmarksGroup, HeadingsGroup };
