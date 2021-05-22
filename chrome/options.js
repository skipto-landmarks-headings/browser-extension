/* options.js */

const debug = true;
const maxLevelItems = document.querySelectorAll('[name="level"]');
const mainOnly = document.querySelector('input[id="main-only"]');

// Get locale-specific message strings
const getMessage = chrome.i18n.getMessage;

const defaultOptions = {
  maxLevelIndex: 1,
  mainOnly: false
};

function setFormLabels () {
  const maxLevelLegend = document.querySelector('fieldset > legend');
  const mainOnlyLabel = document.querySelector('label[for="main-only"]');
  const saveButton = document.querySelector('button');

  maxLevelLegend.textContent = getMessage('maxLevel');
  mainOnlyLabel.textContent = getMessage('mainOnly');
  saveButton.textContent = getMessage('saveButton');
}

function notifySaved () {}

// Save options object to storage.sync

function saveOptions (options) {
  const clearStorage = false;
  if (debug) console.log('saveOptions: ', options);

  if (clearStorage) {
//    chrome.storage.sync.clear();
    return;
  }
  chrome.storage.sync.set(options, function () {
    if (notLastError()) { notifySaved(); }
  });
}

// Save user options selected in form and display message

function saveFormOptions (e) {
  e.preventDefault();

  function getMaxLevelIndex () {
    for (let i = 0; i < maxLevelItems.length; i++) {
      if (maxLevelItems[i].checked) {
        return i;
      }
    }
    return defaultOptions.maxLevelIndex;
  }

  const options = {
    maxLevelIndex: getMaxLevelIndex(),
    mainOnly: mainOnly.checked
  }

  if (debug) console.log(options);
  saveOptions(options);
  window.close();
}

// Update HTML form values based on user options saved in storage.sync

function updateOptionsForm() {
  setFormLabels();

  function updateForm (options) {
    console.log('updateForm: ', options);
    if (Object.keys(options).length === 0) {
      console.log('options object is empty');
      saveOptions(defaultOptions);
    }

    // Set the form element states and values

    if (typeof options.maxLevelIndex === 'undefined') {
      maxLevelItems[defaultOptions.maxLevelIndex].checked = true;
    }
    else {
      maxLevelItems[options.maxLevelIndex].checked = true;
    }

    if (typeof options.mainOnly === 'undefined') {
      mainOnly.checked = defaultOptions.mainOnly;
    }
    else {
      mainOnly.checked = options.mainOnly;
    }
  }

  chrome.storage.sync.get(function (options) {
    if (notLastError()) { updateForm(options); }
  });
}

// Redefine console for Chrome extension
// var console = chrome.extension.getBackgroundPage().console;

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveFormOptions);
