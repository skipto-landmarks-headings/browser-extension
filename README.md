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

## How the Code Works

### Overview

There are two main scripts: *popup* and *content*, and three custom elements:
*SkipToMenu*, *LandmarksGroup* and *HeadingsGroup*. There are also two helper
scripts: *domUtils* and *KbdEventMgr*.

Along side these scripts and custom elements, there are three CSS files:
*menu.css*, *menuitem.css* and *popup.css*, and one HTML file: *popup.html*.

The following sequence describes how the scripts and custom elements work
together after the user invokes the extension (by clicking its button in the
toolbar or pressing its keyboard shortcut), which displays the `SkipTo` popup.

### Setup Phase

1. When the `popup.html` file is loaded, the `popup` script is also loaded.
   The `popup.html` content includes an instance of the `SkipToMenu` custom
   element, with tag name `skipto-menu`.

1. When the `popup` script loads, it:
    1. Registers the three custom elements;
    1. Creates a message listener for the `menudata` message from the
      `content` script;
    1. Executes the `domUtils` and `content` scripts.

1. When the `content` script runs, it:
    1. Creates a message listener for the `skipto` message from the `popup`
       script;
    1. Collects the data from the page loaded into the active tab, based on
       the extension's configuration;
    1. Sends the `menudata` message containing the data to the `popup` script.

1. When `popup` receives the `menudata` message containing the page data, it:
    1. Creates event listeners for the `landmarks` and `headings` events
       dispatched by the `LandmarksGroup` and `HeadingsGroup` elements;
    1. Sets the `menuitems` property on the `LandmarksGroup` and
      `HeadingsGroup` elements.

1. When the setters on the `LandmarksGroup` and `HeadingsGroup` elements are
    activated, they:
    1. Process the landmarks and headings data collected by the `content`
       script;
    1. Dispatch the `landmarks` and `headings` custom events, which are being
       listened for by the `popup` script.

1. When `popup` receives the `landmarks` and `headings` events indicating that
   the custom elements have populated their shadow DOM trees with the
   menuitems corresponding to the data they have been sent, it:
    1. Gets a list of all `menuitems` from `SkipToMenu`;
    1. Creates an instance of `KbdEventMgr`, passing in the `menuitems`. This
       script handles keyboard navigation of all the `menuitems` contained by
       the `SkipToMenu` element.

At this point, the `SkipToMenu` element is fully initialized and its DOM
content is subsequently displayed.

### Menu Activation Phase

When the user activates a menuitem in `SkipToMenu`, firing its `click` event:

1. The `click` event handler `sendSkipToData`, located in the `popup` script:
    1. Sends the `skipto` message to the `content` script, which contains the
      `dataId` of the element in the page corresponding to the activated
       menuitem;
    1. Removes the `LandmarksGroup` and `HeadingsGroup` elements from the
       `SkipToMenu` element, to free memory no longer needed;
    1. Closes the `popup` window.

1. When the `content` script receives the `skipto` message, it calls its
   `skipToContent` function, which:
    1. Gets an appropriate `target` element from the web page loaded into the
       active tab, used for setting focus and scrolling to the selected
       element;
    1. Sets window focus on the `target` element and scrolls it into view.

## Development Notes

_Important:_ The files used in developing the `SkipTo` extension are located
in the top-most directory and in the `shared` folder. The top-most directory
contains files with a `gpp-` prefix, which are processed by a utility called
the `generic preprocessor`, which is freely available as an `npm` package.

The files in the `chrome` and `firefox` folders are either copies of files in
the `shared` folder, or files that result from processing `gpp-` prefixed
files. The `build.sh` script handles processing and copying files to produce
two separately installable extensions, one for Chrome and one for Firefox.

Thus, even though the files in the `chrome` and `firefox` folders are tracked
by Git, they should not be manually modified, as the `build.sh` script will
overwrite all of these files when it is run.
