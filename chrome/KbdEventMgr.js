/* KbdEventMgr.js */

export class KbdEventMgr {
  constructor (menuitems, onClick) {
    this.menuitems = menuitems;
    this.onClick = onClick;

    this.firstMenuitem = menuitems[0];
    this.lastMenuitem  = menuitems[menuitems.length - 1];
    this.pageIncrement = 8;

    for (const menuitem of menuitems) {
      menuitem.addEventListener('keydown', this.onMenuitemKeydown.bind(this));
    }

    this.currentMenuitem = null;
  }

  setFocusToMenuitem (menuitem) {
    for (const item of this.menuitems) {
      if (item === menuitem) {
        item.tabIndex = 0;
        menuitem.focus();
        this.currentMenuitem = menuitem;
      }
      else {
        item.tabIndex = -1;
      }
    }
  }

  setFocusCurrentItem () {
    if (this.currentMenuitem) {
      this.setFocusToMenuitem(this.currentMenuitem);
    }
  }

  setFocusFirstItem () {
    this.setFocusToMenuitem(this.firstMenuitem);
    this.firstMenuitem.scrollIntoView({block: 'end'});
  }

  setFocusLastItem () {
    this.setFocusToMenuitem(this.lastMenuitem);
    this.lastMenuitem.scrollIntoView({block: 'start'});
  }

  setFocusPrevItem (menuitem) {
    if (menuitem === this.firstMenuitem) {
      this.setFocusLastItem();
      return;
    }

    const index = this.menuitems.indexOf(menuitem);
    const newMenuitem = this.menuitems[index - 1];
    this.setFocusToMenuitem(newMenuitem);

    if (newMenuitem === this.firstMenuitem) {
      newMenuitem.scrollIntoView({block: 'end'});
    }
  }

  setFocusNextItem (menuitem) {
    if (menuitem === this.lastMenuitem) {
      this.setFocusFirstItem();
      return;
    }

    const index = this.menuitems.indexOf(menuitem);
    const newMenuitem = this.menuitems[index + 1];
    this.setFocusToMenuitem(newMenuitem);

    if (newMenuitem === this.lastMenuitem) {
      newMenuitem.scrollIntoView({block: 'start'});
    }
  }

  setFocusPrevPage (menuitem) {
    const index = this.menuitems.indexOf(menuitem);

    if (index < this.pageIncrement) {
      this.setFocusFirstItem();
    }
    else {
      const newMenuitem = this.menuitems[index - this.pageIncrement];
      this.setFocusToMenuitem(newMenuitem);
    }
  }

  setFocusNextPage (menuitem) {
    const index = this.menuitems.indexOf(menuitem);

    if (this.menuitems.length - index <= this.pageIncrement) {
      this.setFocusLastItem();
    }
    else {
      const newMenuitem = this.menuitems[index + this.pageIncrement];
      this.setFocusToMenuitem(newMenuitem);
    }
  }

  setFocusNextNavId (menuitem, navId) {
    let newMenuitem;
    const start = this.menuitems.indexOf(menuitem);

    // Start search at next index (loop condition may fail)
    for (let i = start + 1; i < this.menuitems.length; i++) {
      newMenuitem = this.menuitems[i];
      if (newMenuitem.nav === navId) {
        this.setFocusToMenuitem(newMenuitem);
        return;
      }
    }

    // Still looking, start at beginning
    for (let i = 0; i < start; i++) {
      newMenuitem = this.menuitems[i];
      if (newMenuitem.nav === navId) {
        this.setFocusToMenuitem(newMenuitem);
        break;
      }
    }
  }

  // Menuitem event handlers

  onMenuitemKeydown (event) {
    let tgt = event.currentTarget,
        key = event.key,
        flag = false;

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    switch (key) {
      case ' ':
      case 'Enter':
        this.onClick(event);
        break;

      case 'ArrowUp':
        this.setFocusPrevItem(tgt);
        flag = true;
        break;

      case 'ArrowDown':
        this.setFocusNextItem(tgt);
        flag = true;
        break;

      case 'PageUp':
        this.setFocusPrevPage(tgt);
        flag = true;
        break;

      case 'PageDown':
        this.setFocusNextPage(tgt);
        flag = true;
        break;

      case 'Home':
        this.setFocusFirstItem();
        flag = true;
        break;

      case 'End':
        this.setFocusLastItem();
        flag = true;
        break;

      case 'Tab':
        // this.setFocusNextItem(tgt);
        window.close();
        flag = true;
        break;

      case 'm':
      case 'n':
      case 's':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        this.setFocusNextNavId(tgt, key);
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
