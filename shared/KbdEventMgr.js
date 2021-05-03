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
  }

  setFocusToMenuitem (menuitem) {
    for (const item of this.menuitems) {
      if (item === menuitem) {
        item.tabIndex = 0;
        menuitem.focus();
      }
      else {
        item.tabIndex = -1;
      }
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

  setFocusPrevItem (currentMenuitem) {
    if (currentMenuitem === this.firstMenuitem) {
      this.setFocusLastItem();
      return;
    }

    const index = this.menuitems.indexOf(currentMenuitem);
    const newMenuitem = this.menuitems[index - 1];
    this.setFocusToMenuitem(newMenuitem);

    if (newMenuitem === this.firstMenuitem) {
      newMenuitem.scrollIntoView({block: 'end'});
    }
  }

  setFocusNextItem (currentMenuitem) {
    if (currentMenuitem === this.lastMenuitem) {
      this.setFocusFirstItem();
      return;
    }

    const index = this.menuitems.indexOf(currentMenuitem);
    const newMenuitem = this.menuitems[index + 1];
    this.setFocusToMenuitem(newMenuitem);

    if (newMenuitem === this.lastMenuitem) {
      newMenuitem.scrollIntoView({block: 'start'});
    }
  }

  setFocusPrevPage (currentMenuitem) {
    const index = this.menuitems.indexOf(currentMenuitem);

    if (index < this.pageIncrement) {
      this.setFocusFirstItem();
    }
    else {
      const newMenuitem = this.menuitems[index - this.pageIncrement];
      this.setFocusToMenuitem(newMenuitem);
    }
  }

  setFocusNextPage (currentMenuitem) {
    const index = this.menuitems.indexOf(currentMenuitem);

    if (this.menuitems.length - index <= this.pageIncrement) {
      this.setFocusLastItem();
    }
    else {
      const newMenuitem = this.menuitems[index + this.pageIncrement];
      this.setFocusToMenuitem(newMenuitem);
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

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
