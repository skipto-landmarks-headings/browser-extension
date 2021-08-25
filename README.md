# Skip to Landmarks and Headings

<img src="https://github.com/skipto/extension/blob/master/images/skipto-96.png">

## Description

The `Skip to Landmarks and Headings` browser extension for Firefox and Chrome
provides keyboard access to the landmark regions and headings (h1–h6) on a web
page.

When the `Skip To` menu is opened, it displays a list of landmark regions and
headings based on the content of the page currently loaded in the active tab
of the browser and on the extension's configuration settings.

When a menu item is activated, the `popup` window is closed and the extension
sets focus to the selected element and scrolls it into view, in effect,
allowing you to "skip to" the selected content.

The `Skip To` menu, which is keyboard navigable, also provides an outline of
the major sections and topics on a web page, making it easier for people to
understand and find content on well-structured pages.

### Keyboard Shortcuts

To open the `Skip To` menu via the keyboard, use `Alt+2`.
Focus is set to the first menu item.

Once the menu is displayed and has focus, you can move through the menu items
via the following keystrokes:

* `arrow down`, `arrow up`: step through the items one at a time
* `page down`, `page up`: move eight items forward or backward
* `home`, `end`: move to first or last item
* `m`: next `main` landmark
* `s`: next `search` landmark
* `n`: next `navigation` landmark
* `a`: next `complementary` landmark (optionally included based on user preference)
* `c`: next `contentinfo` landmark
* `1`, `2`, `3`, `4`, `5`, `6`: next heading of that level
  (e.g. `2` -> go to next `h2`)

#### To activate a menu item
* If the menu item has focus, press `enter` or `space`, or
* `click` any menu item with the mouse.

#### To close the menu without activating a menu item
* Press `tab` or `escape`, or
* `click` the `Skip To` toolbar button, or
* `click` somewhere outside of the popup window.

## Options/Preferences

Users have access to the following options for controlling what is displayed
in the `Skip To` menu:
* Include `complementary` landmarks (toggle on/off)
* Limit the maximum depth for `heading` levels (select level 2 – 6)
* Show `heading` level numbers (toggle on/off)
* Only show headings found in `main` landmark (toggle on/off)

## Installation

### Reviewed and Approved Versions

Current versions for Firefox and Chrome are available at their respective
`add-ons` websites:

* [Firefox version at Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/skipto/)
* [Chrome version at Chrome Web Store](https://chrome.google.com/webstore/detail/skipto/fjkpbfcodhflpdildjbmdhhmcoplghgf)

### Development Versions

The latest development version of the `Skip To` extension can be installed by
cloning this GitHub repo (`https://github.com/skipto/extension`). Once you
have a working copy of the repository, follow the instructions for one of the
following browsers.

#### Chrome

1. Open the `Extensions` tab from the Chrome main menu.
1. Enable `Developer mode` using the toggle in the upper right corner.
1. Select the `Load unpacked` button (upper left) and navigate to the Git
   working copy of `extension` (see above).
1. Within the `extension` folder, select the `chrome` folder.
1. The `Skip To` button, displaying the `Skip To` logo image, should appear in
   the Chrome toolbar.

#### Firefox

1. In the Firefox location bar, type `about:debugging`.
1. In the left column menu of the tab that opens, select `This Firefox`.
1. Under `Temporary Extensions`, select `Load Temporary Add-on...` and
   navigate to the Git working copy of `extension` (see above).
1. Open the `firefox` folder and select the `manifest.json` file.
1. The `Skip To` button, displaying the `Skip To` logo image, should appear in
   the Firefox toolbar.
