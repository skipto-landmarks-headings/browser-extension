/* content.js */

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
  }
  browser.runtime.sendMessage(message);
}

sendHeadingsData();
