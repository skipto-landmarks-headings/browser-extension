# SkipTo Extension

## How it works

### Overview

There are two main scripts: *popup* and *content*, and three custom elements:
*SkipToMenu*, *LandmarksGroup* and *HeadingsGroup*. There are also two helper
scripts: *domUtils* and *KbdEventMgr*.

Along side these scripts and custom elements, there are three CSS files:
*menu.css*, *menuitem.css* and *popup.css*, and one HTML file: *popup.html*.

The following sequence describes how the scripts and custom elements work
together after the user invokes the extension (by clicking its button in the
toolbar or pressing its keyboard shortcut), which displays the SkipTo popup.

### Setup Phase

1. When the `popup.html` file is loaded, the `popup` script is also loaded.
   The `popup.html` content includes an instance of the `SkipToMenu` custom
   element, with tag name `skipto-menu`.

1. When the `popup` script loads, it:
    1. Registers the three custom elements;
    1. Creates a message listener for the `content` message from the
      `content` script;
    1. Executes the `domUtils` and `content` scripts.

1. When the `content` script runs, it:
    1. Creates a message listener for the `popup` message from the `popup`
       script;
    1. Collects the data from the page loaded into the active tab, based on
       the extension's configuration;
    1. Sends the `content` message containing the data to the `popup` script.

1. When `popup` receives the `content` message containing the page data, it:
    1. Creates event listeners for the `LandmarksGroup` and `HeadingsGroup`
       elements;
    1. Sets the `menuitems` properties on the `LandmarksGroup` and
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
       script handles keyboard navigation of the `SkipToMenu` element's
       `menuitems`.

At this point, the `SkipToMenu` element is fully initialized and its DOM
content is subsequently displayed.

### Menu Activation Phase

When the user activates a menuitem, its `click` event handler initiates the
following sequence:

1. The `click` event handler `sendSkipToData`, located in the `popup` script:
    1. Sends the `popup` message to the `content` script, which contains the
      `dataId` of the element in the page corresponding to the activated
       menuitem;
    1. Removes the `LandmarksGroup` and `HeadingsGroup` element contents from
       the `SkipToMenu` element, to free memory no longer needed;
    1. Closes the `popup` window.

1. When the `content` script receives the `popup` message, it calls its
   `skipToContent` function, which:
    1. Gets a `target` element from the web page loaded into the active tab,
       used for setting focus and scrolling to the appropriate element;
    1. Sets focus on the `target` element and scrolls it into view.
