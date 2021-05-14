/* GroupContainer.js */

const template = document.createElement('template');
template.innerHTML = `
<div class="container">
  <div role="separator" class="group-label">
    <span slot="group-label">group label</span>
  </div>
  <div class="message" class="group-message">
    <span slot="group-message">group message</span>
  </div>
  <div slot="menu-group"></div>
</div>
`;

class GroupContainer extends HTMLElement {

}
