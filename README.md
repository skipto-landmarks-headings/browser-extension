# SkipTo Landmarks & Headings

<img src="https://github.com/skipto/extension/blob/master/images/skipto-96.png">

## Description

The `SkipTo Landmarks & Headings` browser extension for Firefox and Chrome provides keyboard access to the landmark regions and headings (h1–h6) on a web page.

When the `SkipTo` menu is opened, it displays a list of landmark regions and headings based on the content of the page currently loaded in the active tab of the browser and on the extension's configuration settings.

When a menu item is activated, the `popup` window is closed and the extension sets focus to the selected element and scrolls it into view, in effect, allowing you to "skip to" the selected content.

The `SkipTo` menu, which is keyboard navigable, also provides an outline of the major sections and topics on a web page, making it easier for people to understand and find content on well-structured pages.

### More Information

Complete documentation on keyboard shortcuts, options/preferences and more is available at the <a href="https://skipto.github.io/">SkipTo Documentation</a> website.

## Installation

### Reviewed and Approved Versions

Current versions for Firefox and Chrome are available at their respective
`add-ons` websites:

* [Firefox version at Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/skipto/)
* [Chrome version at Chrome Web Store](https://chrome.google.com/webstore/detail/skipto/fjkpbfcodhflpdildjbmdhhmcoplghgf)

### Development Versions

The latest development version of the `SkipTo` extension can be installed by cloning this GitHub repo (`https://github.com/skipto/extension`). Once you have a working copy of the repository, follow the instructions for one of the following browsers.

#### Chrome

1. Open the `Extensions` tab from the Chrome main menu.
1. Enable `Developer mode` using the toggle in the upper right corner.
1. Select the `Load unpacked` button (upper left) and navigate to the Git working copy of `extension` (see above).
1. Within the `extension` folder, select the `chrome` folder.
1. The `SkipTo` button, displaying the `SkipTo` logo image, should appear in the Chrome toolbar.

#### Firefox

1. In the Firefox location bar, type `about:debugging`.
1. In the left column menu of the tab that opens, select `This Firefox`.
1. Under `Temporary Extensions`, select `Load Temporary Add-on...` and navigate to the Git working copy of `extension` (see above).
1. Open the `firefox` folder and select the `manifest.json` file.
1. The `SkipTo` button, displaying the `SkipTo` logo image, should appear in the Firefox toolbar.
