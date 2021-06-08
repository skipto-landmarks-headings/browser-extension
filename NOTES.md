# Development Notes

The `SkipTo` browser extension collects data from the web page loaded in the
active tab using CSS `querySelector` functions targeted at ARIA `landmark`
regions (`main`, `search` and `navigation`) and HTML `heading` elements
(`h1`–`h6`) contained in the page.

The `SkipToMenu` element, which is displayed in a `popup` window, organizes
this data into a menu system that is keyboard navigable.

Each menuitem in the menu contains a `dataId` corresponding to one of the
`landmark` or `heading` elements in the active tab web page.

When a menuitem is activated, the `popup` window is closed and the extension
sets focus to the selected element and scrolls it into view.

## How the Code Works

### Overview

The following JavaScript files are the key players in understanding how the
SkipTo extension works:

* MenuGroup.js
* SkipToMenu.js
* popup.js
* content.js
* options.js
* background.js

Additionally, the following files contain helper classes or functions:

* KbdEventMgr.js
* domUtils.js
* i18n.jg

When the user activates the extension button, `popup.html` is displayed.
This causes `popup.js`, i.e. the `popup` script to load.

### Synchronous and Asynchronous Actions: Messages and Listeners

#### popup script

When the `popup` script runs, it immediately does the following:

1. Creates a listener named `connectionHandler` for the port connection
   from the `content` script;

1. Executes the `content` script.

#### content script

When the `content` script runs, it immediately:

1. Establishes a port connection with the `popup` script;

1. Creates a listener on that port for messages from the `popup` script:
   `id: storage`, `id: skipto` and `id: cleanup`.

#### popup script

When the port connection is established from the `content` script, the `popup`
script's `connectionHandler` function is invoked. It:

1. Creates a listener named `portMessageHandler` for the port message it will
   receive from the `content` script with `id: menudata`;

1. Creates a listener for the one-off message from the `background` script
   with `id: storage`;

1. Sends a one-off message to the `background` script with `id: getStorage`.

#### background script

The `background` script is persistent: once the extension is installed, it
loads whenever the browser starts up and its functions and variables stay in
memory. When it runs, it:

1. Retrieves the user options from `storage.sync` and creates a listener
   for any changes to the options, which enables it to keep its `storageCache`
   variable up to date.

1. Creates a listener for the one-off message from the `popup` script with
   `id: getStorage`.

When the `background` script receives the `getStorage` message, it sends the
user options from `storageCache` to the `popup` script in a message with
`id: storage`.

#### popup script

When the `popup` script receives the `id: storage` message from the
`background` script, it passes the message with `id: storage` directly to the
`content` script via the function `initProcessing`.

#### content script

When the `content` script receives the `id: storage` message it begins
processing the web page using CSS `querySelector` functions, and for each
landmark or heading element found, it:

1. Extracts data needed for building the landmarks and headings menu items;

1. Adds a `data-skipto` attribute with a unique value to the element.

After processing all of the relevant nodes, the `content` script sends a
message with `id: menudata` to the `popup` script containing the data it has
collected.

### SkipTo Menu Construction Phase

The menu construction phase makes use of the custom elements `LandmarksGroup`,
`HeadingsGroup` and `SkipToMenu`. The first two are defined in the
`MenuGroup.js` file, and the latter in `SkipToMenu.js`.

#### popup script

When the `popup` script receives the message with `id: menudata`, it:

1. Registers an event listener for the `status` events dispatched by the
   `LandmarksGroup` and `HeadingsGroup` elements, which will indicate that
   each has completed the construction of its respective menu group;

1. Sets the `menudata` property on the `LandmarksGroup` and `HeadingsGroup`
   elements, which kicks of the process of by which the menu groups add
   the menuitems corresponding to the data from the `content` script.

#### LandmarksGroup and HeadingsGroup

When the setters on the `LandmarksGroup` and `HeadingsGroup` elements are
activated, they:

1. Process the landmarks and headings data collected by the `content` script;

1. Dispatch the `landmarks` and `headings` custom events, which are being
   listened for by the `popup` script.

#### popup script and SkipToMenu

When the `popup` script receives the `status` events indicating that the
custom elements have populated their shadow DOM trees with the menuitems
corresponding to the data they have been sent, it:

1. Gets a list of all `menuitems` from `SkipToMenu`, which is a container
   for the menu group elements;

1. Creates an instance of `KbdEventMgr`, passing in the `menuitems`. This
   script handles keyboard navigation of all the `menuitems` contained by
   the `SkipToMenu` element.

At this point, the `SkipToMenu` element is fully initialized and its DOM
content is subsequently displayed.

### Menu Interaction Phase

When the user activates a menuitem in `SkipToMenu`, firing its `click` event,
the `click` event handler `sendSkipToData`, located in the `popup` script:

1. Sends the message `id: skipto` to the `content` script, which includes the
  `dataId` of the element in the page corresponding to the activated menuitem;

1. Removes the `LandmarksGroup` and `HeadingsGroup` elements from the
   `SkipToMenu` element, to free memory no longer needed;

1. Closes the `popup` window.

When the `content` script receives the `id: skipto` message, it calls its
`skipToContent` function, which:

1. Gets an appropriate `target` element from the web page loaded into the
   active tab, used for setting focus and scrolling to the selected element;

1. Sets window focus on the `target` element and scrolls it into view.

Finally, after the `popup` script has sent of the `id: skipto` message and
called the `window.close` function, its `window unload` event listener is
invoked, which does the following:

1. Instructs the `SkipToMenu` component to remove its groups, to free up
   memory;

1. Sends the message `id: cleanup` to the `content` script, which triggers
   the removal of all the `data-skipto` attributes from the web page DOM.

The `id: cleanup` message prevents incorrect correlations of menuitems to
DOM elements in the case where the user changes the headings level
configuration while remaining on the same web page.

## Build Notes

_Important:_ The files used in developing the `SkipTo` extension are located
in the top-most directory and in the `shared` folder. The top-most directory
contains files with a `gpp-` prefix, which are processed by a utility called
the `generic preprocessor`, free software available at
https://logological.org/gpp and distributed under the  GNU Lesser General
Public Licence.

The files in the `chrome` and `firefox` folders are either copies of files in
the `shared` folder, or files that result from processing `gpp-` prefixed
files. The `build.sh` script handles processing and copying files to produce
two separately installable extensions, one for Chrome and one for Firefox.

Thus, even though the files in the `chrome` and `firefox` folders are tracked
by Git, they should not be manually modified, as the `build.sh` script will
overwrite all of these files when it is run.

