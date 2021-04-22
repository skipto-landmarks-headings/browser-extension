/* content.js */

/*
**  Set up listener/handler for message from popup script
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
**  Perform the action specified by activated menu item
*/
function skipToContent (dataId) {
  let selector = `[data-skipto="${dataId}"]`;
  let element = document.querySelector(selector);
  if (element) {
    element.setAttribute('tabindex', '-1');
    element.focus();
    if (dataId.startsWith('l-')) {
      element.scrollIntoView( {behavior: "smooth", block: "start", inline: "nearest"} );
    }
    else {
      element.scrollIntoView( {behavior: "smooth", block: "center", inline: "nearest"} );
    }
  }
}

/*
**  When this script is executed directly, extract the skipto
**  menu data and send it to the popup script.
*/
function getLandmarkElements () {
  return document.querySelectorAll('main, [role="main"], [role="search"], nav, [role="navigation"]');
}

function getHeadingElements () {
  return document.querySelectorAll('main h1, [role="main"] h1, main h2, [role="main"] h2');
}

(function () {
  let landmarksArray = [];
  let headingsArray = [];
  let counter = 0;
  let dataAttribName = 'data-skipto';
  let dataId;

  let landmarkElements = getLandmarkElements();
  let headingElements = getHeadingElements();

  // Process the landmarkElements
  let mainLandmarks = document.querySelectorAll('main, [role="main"]');
  let searchLandmarks = document.querySelectorAll('[role="search"]');
  let navigationLandmarks = document.querySelectorAll('nav, [role="navigation"]');

  mainLandmarks.forEach(function (elem) {
    dataId = `l-${++counter}`;
    elem.setAttribute(dataAttribName, dataId);

    let landmarkInfo = {
      tagName: elem.tagName.toLowerCase(),
      ariaRole: 'Main',
      dataId: dataId
    }
    landmarksArray.push(landmarkInfo);
  });

  searchLandmarks.forEach(function (elem) {
    dataId = `l-${++counter}`;
    elem.setAttribute(dataAttribName, dataId);

    let landmarkInfo = {
      tagName: elem.tagName.toLowerCase(),
      ariaRole: 'Search',
      dataId: dataId
    }
    landmarksArray.push(landmarkInfo);
  });

  navigationLandmarks.forEach(function (elem) {
    dataId = `l-${++counter}`;
    elem.setAttribute(dataAttribName, dataId);

    let landmarkInfo = {
      tagName: elem.tagName.toLowerCase(),
      ariaRole: 'Navigation',
      dataId: dataId
    }
    landmarksArray.push(landmarkInfo);
  });

  // Process the heading elements
  headingElements.forEach(function (elem) {
    dataId = `h-${++counter}`;
    elem.setAttribute(dataAttribName, dataId);

    let headingInfo = {
      tagName: elem.tagName.toLowerCase(),
      content: elem.textContent.trim(),
      dataId: dataId
    };
    headingsArray.push(headingInfo);
  });

  const message = {
    id: 'content',
    landmarks: landmarksArray,
    headings: headingsArray
  };
  browser.runtime.sendMessage(message);
})();
