/* content.js */

/*
*   Set up the listener for message from popup script
*/
browser.runtime.onMessage.addListener(messageHandler);

function messageHandler (message, sender) {
  switch (message.id) {
    case 'popup':
      skipToContent(message.data);
      break;
  }
}

/*
*   Perform the action requested by menu activation
*/
function skipToContent (data) {
  let selector = `[data-skipto="${data}"]`;
  let element = document.querySelector(selector);
  if (element) {
    element.setAttribute('tabindex', '-1');
    element.focus();
    element.scrollIntoView({block: 'center'});
  }
}

/*
*   Functions that are called when the script is executed:
*   Extract the page data and send it to the popup script.
*/
function getHeadingElements () {
  return document.querySelectorAll('h1,h2');
}

function sendHeadingsData () {
  let headingsArray = [];
  let counter = 0;
  let dataAttribName = 'data-skipto';

  headingElements = getHeadingElements();

  headingElements.forEach(function (elem) {
    let dataId = `h-${++counter}`;
    elem.setAttribute(dataAttribName, dataId);

    let headingInfo = {
      tag: elem.tagName.toLowerCase(),
      content: elem.textContent.trim(),
      dataId: dataId
    };

    headingsArray.push(headingInfo);
  });

  const message = {
    id: 'content',
    data: headingsArray
  };
  browser.runtime.sendMessage(message);
}

sendHeadingsData();
