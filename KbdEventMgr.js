/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   KbdEventMgr.js
 *
 *   Desc:   Creates an object that manages keyboard navigation of menuitems
 */

class KbdEventMgr {
  constructor (menuNode, onClick) {
    this.menuNode = menuNode;
    this.onClick = onClick;

    this.menuitems = [];
    this.firstMenuitem = null;
    this.lastMenuitem = null;

    const menuitemNodes = this.menuNode.querySelectorAll('div[role="group"] > div');
    menuitemNodes.forEach((menuitem) => {
      menuitem.addEventListener('keydown', this.onMenuitemKeydown.bind(this));
      this.menuitems.push(menuitem);

      if (!this.firstMenuitem) {
        this.firstMenuitem = menuitem;
      }
      this.lastMenuitem = menuitem;
    });
  }

  setFocusToMenuitem (menuitem) {
    this.menuitems.forEach(function (item) {
      if (item === menuitem) {
        item.tabIndex = 0;
        menuitem.focus();
      }
      else {
        item.tabIndex = -1;
      }
    });
  }

  setFocusToFirstMenuitem () {
    this.setFocusToMenuitem(this.firstMenuitem);
    this.firstMenuitem.scrollIntoView({block: 'end'});
  }

  setFocusToLastMenuitem () {
    this.setFocusToMenuitem(this.lastMenuitem);
  }

  setFocusToPreviousMenuitem (currentMenuitem) {
    let newMenuitem;

    if (currentMenuitem === this.firstMenuitem) {
      return; // newMenuitem = this.lastMenuitem;
    }
    else {
      const index = this.menuitems.indexOf(currentMenuitem);
      newMenuitem = this.menuitems[index - 1];
    }

    this.setFocusToMenuitem(newMenuitem);
    if (newMenuitem === this.firstMenuitem) {
      newMenuitem.scrollIntoView({block: 'end'});
    }
  }

  setFocusToNextMenuitem (currentMenuitem) {
    let newMenuitem;

    if (currentMenuitem === this.lastMenuitem) {
      return; // newMenuitem = this.firstMenuitem;
    }
    else {
      const index = this.menuitems.indexOf(currentMenuitem);
      newMenuitem = this.menuitems[index + 1];
    }

    this.setFocusToMenuitem(newMenuitem);
  }

  // Menuitem event handlers

  onMenuitemKeydown (event) {
    let tgt = event.currentTarget,
        key = event.key,
        flag = false;

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.shiftKey && event.key === 'Tab') {
      this.setFocusToPreviousMenuitem(tgt);
      flag = true;
    }
    else {
      switch (key) {
        case ' ':
        case 'Enter':
          this.onClick(event);
          break;

        case 'Up':
        case 'ArrowUp':
          this.setFocusToPreviousMenuitem(tgt);
          flag = true;
          break;

        case 'ArrowDown':
        case 'Down':
          this.setFocusToNextMenuitem(tgt);
          flag = true;
          break;

        case 'Home':
        case 'PageUp':
          this.setFocusToFirstMenuitem();
          flag = true;
          break;

        case 'End':
        case 'PageDown':
          this.setFocusToLastMenuitem();
          flag = true;
          break;

        case 'Tab':
          this.setFocusToNextMenuitem(tgt);
          flag = true;
          break;

        default:
          break;
      }
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

export { KbdEventMgr as default };
