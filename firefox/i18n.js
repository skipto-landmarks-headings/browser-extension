/* i18n.js */

// Get locale-specific message strings
const getMessage = browser.i18n.getMessage;

// MenuGroup.js
export const landmarksLabel = getMessage('landmarksLabel');
export const noLandmarksMsg = getMessage('noLandmarksMsg');
export const headingsLabel  = getMessage('headingsLabel');
export const noHeadingsMsg  = getMessage('noHeadingsMsg');
export const headingLevel   = getMessage('headingLevel');
export const emptyContent   = getMessage('emptyContent');

export { getMessage as default };
