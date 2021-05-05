# SkipTo Extension

## Description

The `SkipTo` browser extension for Firefox and Chrome provides keyboard
access to the landmark regions and headings (H1–H6) on a web page.

When the `SkipTo` menu is opened, it displays a list of landmark regions and
headings based on the content of the page currently loaded in the active tab
of the browser and on the extension's configuration settings.

When a menu item is activated, the `popup` window is closed and the extension
sets focus to the selected element and scrolls it into view, in effect,
allowing you to "skip to" the selected content.

The `SkipTo` menu, which is keyboard navigable, also provides an outline of
the major sections and topics on a web page, making it easier for people to
understand and find content on well-structured pages.

### Keyboard Shortcuts

To open the `SkipTo` menu via the keyboard, use `Ctrl/Cmd + Shift + K`. Focus
is set to the first menu item.

Once the menu is displayed and has focus, you can move through the menu items
via the following keystrokes:

* `arrow down`, `arrow up`: step through the items one at a time
* `page down`, `page up`: move eight items forward or backward
* `home`, `end`: move to first or last item
* `m`: next `main` landmark
* `n`: next `navigation` landmark
* `s`: next `search` landmark
* `1`, `2`, `3`, `4`, `5`, `6`: next heading of that level
  (e.g. `2` -> go to next `H2`)

#### To activate a menu item
* If the menu item has focus, press `enter` or `space`, or
* `click` any menu item with the mouse.

#### To close the menu without activating a menu item
* Press `tab` or `escape`, or
* `click` the `SkipTo` toolbar button, or
* `click` somewhere outside of the popup window.

## Installation

Currently, the `SkipTo` extension can be installed by cloning the GitHub repo
at `https://github.com/skipto/extension`. Once you have cloned the repository,
follow the instructions for one of the following browsers.

### Chrome

1. Open the `Extensions` tab from the Chrome main menu.
1. Enable `Developer mode` using the toggle in the upper right corner.
1. Select the `Load unpacked` button (upper left) and navigate to the Git
   working copy of `extension` (see above).
1. Within the `extension` folder, select the `chrome` folder.
1. The `SkipTo` button (currently labeled with an `S`) should appear in the
   Chrome toolbar.

### Firefox

1. In the Firefox location bar, type `about:debugging`.
1. In the left column menu of the tab that opens, select `This Firefox`.
1. Under `Temporary Extensions`, select `Load Temporary Add-on...` and
   navigate to the Git working copy of `extension` (see above).
1. Open the `firefox` folder and select the `manifest.json` file.
1. The `SkipTo` button (currently a green jigsaw puzzle piece icon) should
   appear in the Firefox toolbar.
