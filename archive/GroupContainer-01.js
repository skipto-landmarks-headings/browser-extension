/* GroupContainer.js */

const template = document.createElement('template');
template.innerHTML = `
<div class="container">
  <div role="separator" class="group-label">
    <span slot="label">group label</span>
  </div>
  <div class="message" class="group-message">
    <span slot="message">group message</span>
  </div>
  <slot name="group"></slot>
</div>
`;

class GroupContainer extends HTMLElement {

}
