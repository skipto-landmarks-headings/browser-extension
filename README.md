# SkipTo Extension

## Description

The `SkipTo` browser extension collects data from the web page loaded in the
active tab that corresponds to a select list of ARIA `landmark` regions and
HTML `heading` elements contained in the page.

The `SkipToMenu` element, which is displayed in a `popup` window, organizes
this data into a menu system that is keyboard navigable.

Each menuitem in the menu contains a `dataId` corresponding to one of the
`landmark` or `heading` elements in the active tab web page.

When a menuitem is activated, the `popup` window is closed and the extension
sets focus to the selected element and scrolls it into view, in effect,
allowing you to "skip to" the selected content.

### Keyboard Shortcut

To activate `SkipTo` via the keyboard, use `Ctrl/Cmd + Shift + K`.

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
