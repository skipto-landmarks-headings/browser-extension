/* options.js */

import { getOptions, saveOptions } from './storage.js';
import getMessage from './i18n.js';

const debug = false;
const maxLevelItems = document.querySelectorAll('[name="level"]');
const mainOnly      = document.querySelector('input[id="main-only"]');
const showLevels    = document.querySelector('input[id="show-levels"]');

function setFormLabels () {
  const maxLevelLegend  = document.querySelector('fieldset > legend');
  const mainOnlyLabel   = document.querySelector('label[for="main-only"]');
  const showLevelsLabel = document.querySelector('label[for="show-levels"]');
  const saveButton      = document.querySelector('button');

  maxLevelLegend.textContent  = getMessage('maxLevelLabel');
  mainOnlyLabel.textContent   = getMessage('mainOnlyLabel');
  showLevelsLabel.textContent = getMessage('showLevelsLabel');
  saveButton.textContent      = getMessage('buttonLabel');
}

function notifySaved () {
  const message = getMessage('optionsSavedMsg');
  const status = document.getElementById('status');
  status.textContent = message;

  setTimeout(function () { status.textContent = ''; }, 1500);
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
  }

  const options = {
    maxLevelIndex: getMaxLevelIndex(),
    mainOnly: mainOnly.checked,
    showLevels: showLevels.checked
  }

  if (debug) console.log(options);
  saveOptions(options).then(notifySaved);
}

// Update HTML form values based on user options saved in storage.sync

function updateOptionsForm() {
  setFormLabels();

  function updateForm (options) {
    console.log('updateForm: ', options);

    // Set form element values and states
    maxLevelItems[options.maxLevelIndex].checked = true;
    mainOnly.checked = options.mainOnly;
    showLevels.checked = options.showLevels;
  }

  getOptions().then(updateForm);
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveFormOptions);
