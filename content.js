/* content.js */

function getHeadingElements () {
  return document.querySelectorAll('h1,h2');
}

function sendHeadingsData () {
  let headingsArray = [];
  headingElements = getHeadingElements();

  headingElements.forEach(function (elem) {
    let headingInfo = {
      tag: elem.tagName,
      content: elem.textContent.trim()
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
