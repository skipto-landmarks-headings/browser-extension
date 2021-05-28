/* MenuBuilder.js */

import { LandmarksGroup, HeadingsGroup } from './MenuGroup.js';
customElements.define('landmarks-group', LandmarksGroup);
customElements.define('headings-group', HeadingsGroup);

const numGroups = 2;

export default class MenuBuilder {
  constructor (clickHandler, completedCallback) {
    this.landmarksGroup = document.querySelector('landmarks-group');
    this.headingsGroup  = document.querySelector('headings-group');

    this.clickHandler = clickHandler;
    this.completedCallback = completedCallback;
    this.groupsCompleted = 0;
  }

  groupStatus (evt) {
    this.groupsCompleted++;
    if (this.groupsCompleted === numGroups) {
      this.completedCallback();
    }
  }

  constructMenu (message)  {
    this.landmarksGroup.menuitemClickHandler = this.clickHandler;
    this.headingsGroup.menuitemClickHandler  = this.clickHandler;

    this.landmarksGroup.addEventListener('status', this.groupStatus.bind(this));
    this.headingsGroup.addEventListener('status', this.groupStatus.bind(this));

    this.landmarksGroup.menudata = message.landmarks;
    this.headingsGroup.menudata  = message.headings;
  }
}
