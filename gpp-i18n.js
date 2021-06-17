/* i18n.js */

// Get locale-specific message strings
#ifdef FIREFOX
const getMessage = browser.i18n.getMessage;
#endif
#ifdef CHROME
const getMessage = chrome.i18n.getMessage;
#endif

// MenuGroup.js
export const landmarksLabel = getMessage('landmarksLabel');
export const noLandmarksMsg = getMessage('noLandmarksMsg');
export const headingsLabel  = getMessage('headingsLabel');
export const noHeadingsMsg  = getMessage('noHeadingsMsg');
export const emptyContent   = getMessage('emptyContent');

export { getMessage as default };
