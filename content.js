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
**  getTargetElement: Find an element that is focusable based on the type of
**  landmark that element is.
*/
function getTargetElement (dataId, element) {
  let contentSelector = 'h1, h2, h3, h4, h5, h6, p, li, img, input, select, textarea';
  let isSearch = dataId.startsWith('s-');
  let isNav = dataId.startsWith('n-');

  if (isSearch) {
    return element.querySelector('input');
  }

  if (isNav) {
    return element.querySelector('a');
  }

  // Must be main landmark
  return element.querySelector(contentSelector);
}

/*
**  Perform the action specified by activated menu item
*/
function skipToContent (dataId) {
  let selector = `[data-skipto="${dataId}"]`;
  let isHeading = dataId.startsWith('h-');
  let target = null;

  let element = document.querySelector(selector);
  if (element) {
    target = isHeading ? element : getTargetElement(dataId, element);
    if (target && isVisible(target)) {
      let options = { behavior: 'smooth', block: 'center' };
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView(options);
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
    dataId = `m-${++counter}`;
    elem.setAttribute(dataAttribName, dataId);

    let landmarkInfo = {
      tagName: elem.tagName.toLowerCase(),
      ariaRole: 'Main',
      accessibleName: getAccessibleName(elem),
      dataId: dataId
    }
    landmarksArray.push(landmarkInfo);
  });

  searchLandmarks.forEach(function (elem) {
    dataId = `s-${++counter}`;
    elem.setAttribute(dataAttribName, dataId);

    let landmarkInfo = {
      tagName: elem.tagName.toLowerCase(),
      ariaRole: 'Search',
      accessibleName: getAccessibleName(elem),
      dataId: dataId
    }
    landmarksArray.push(landmarkInfo);
  });

  navigationLandmarks.forEach(function (elem) {
    dataId = `n-${++counter}`;
    elem.setAttribute(dataAttribName, dataId);

    let landmarkInfo = {
      tagName: elem.tagName.toLowerCase(),
      ariaRole: 'Navigation',
      accessibleName: getAccessibleName(elem),
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
