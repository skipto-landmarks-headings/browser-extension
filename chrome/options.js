/* options.js */

import { getOptions, saveOptions } from './storage.js';
import getMessage from './i18n.js';

const debug = false;
const inclComp       = document.querySelector('input[id="incl-comp"]');
const maxLevelItems  = document.querySelectorAll('[name="level"]');
const showLevels     = document.querySelector('input[id="show-levels"]');
const mainOnly       = document.querySelector('input[id="main-only"]');

function setFormLabels () {
  const landmarksLabel  = document.querySelector('h2[id="landmarks"]');
  const headingsLabel   = document.querySelector('h2[id="headings"]');
  const inclCompLabel   = document.querySelector('label[for="incl-comp"]');
  const maxLevelLegend  = document.querySelector('fieldset > legend');
  const showLevelsLabel = document.querySelector('label[for="show-levels"]');
  const mainOnlyLabel   = document.querySelector('label[for="main-only"]');
  const saveButton      = document.querySelector('button');

  landmarksLabel.textContent  = getMessage('landmarksLabel');
  headingsLabel.textContent   = getMessage('headingsLabel');
  inclCompLabel.textContent   = getMessage('inclCompLabel');
  maxLevelLegend.textContent  = getMessage('maxLevelLabel');
  showLevelsLabel.textContent = getMessage('showLevelsLabel');
  mainOnlyLabel.textContent   = getMessage('mainOnlyLabel');
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
    inclComp: inclComp.checked,
    maxLevelIndex: getMaxLevelIndex(),
    showLevels: showLevels.checked,
    mainOnly: mainOnly.checked
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
    inclComp.checked = options.inclComp;
    maxLevelItems[options.maxLevelIndex].checked = true;
    showLevels.checked = options.showLevels;
    mainOnly.checked = options.mainOnly;
  }

  getOptions().then(updateForm);
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveFormOptions);
