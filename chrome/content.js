/* content.js */

var options = {
  headings: {
    maxLevel: 3,
    mainOnly: false
  }
};

/*
**  Set up listener/handler for message from popup script
*/
chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler (message, sender) {
  switch (message.id) {
    case 'skipto':
      skipToContent(message.data);
      break;
  }
}

/*
**  getTargetElement: Find an element that is focusable based on the
**  aria role of the landmark (indicated by dataId prefix).
*/
function getTargetElement (dataId, element) {
  let selectorsArray = ['h1', 'a[href]', 'h2', 'h3', 'section', 'article', 'h4', 'h5', 'h6', 'p', 'li'];
  let isSearch = dataId.startsWith('s-');
  let isNav = dataId.startsWith('n-');

  if (isSearch) {
    return element.querySelector('input');
  }

  if (isNav) {
    let elements = element.querySelectorAll('a');
    for (const elem of elements) {
      if (isVisible(elem)) return elem;
    }
    return element;
  }

  // Must be main landmark
  for (const selector of selectorsArray) {
    let elem = element.querySelector(selector);
    if (elem && isVisible(elem)) {
      console.log(`target for main: ${elem.tagName.toLowerCase()}`);
      return elem;
    }
  }
  return element;
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
    else {
      let status = (target === null) ? 'null' : !isVisible(target) ? 'not visible' : 'unknown';
      console.log(`target: ${target.tagName.toLowerCase()} - status: ${status}`);
    }
  }
}

/*
**  getHeadingSelector: Return a CSS selector for heading levels 1
**  through 'maxLevel'. If 'mainOnly' is true, select headings only
**  if they are contained within a 'main' landmark.
*/
function getHeadingSelector () {
  let maxLevel = options.headings.maxLevel;
  let mainOnly = options.headings.mainOnly;
  let selectors = [];
  for (let i = 1; i <= maxLevel; i++) {
    let tagName = `h${i}`;
    if (mainOnly) {
      selectors.push(`main ${tagName}`, `[role="main"] ${tagName}`);
    }
    else {
      selectors.push(tagName);
    }
  }
  return selectors.join(', ');
}

/*
**  getHeadingElements: Return a nodelist of all headings in the
**  document based on the specified and constructed CSS selector.
*/
function getHeadingElements () {
  let selector = getHeadingSelector();
  console.log(selector);
  return document.querySelectorAll(selector);
}

/*
**  When this script is executed directly, extract the skipto menu
**  data and send it to the popup script.
*/
(function () {
  let landmarksArray = [];
  let headingsArray = [];
  let counter = 0;
  let dataAttribName = 'data-skipto';

  // Process the landmark elements
  let mainLandmarks = document.querySelectorAll('main, [role="main"]');
  let searchLandmarks = document.querySelectorAll('[role="search"]');
  let navigationLandmarks = document.querySelectorAll('nav, [role="navigation"]');

  function getLandmarkInfo (elem, dataId, role) {
    return {
      tagName: elem.tagName.toLowerCase(),
      ariaRole: role,
      accessibleName: getLandmarkAccessibleName(elem),
      dataId: dataId
    };
  }

  mainLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      let dataId = `m-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      landmarksArray.push(getLandmarkInfo(elem, dataId, 'main'));
    }
  });

  searchLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      let dataId = `s-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      landmarksArray.push(getLandmarkInfo(elem, dataId, 'search'));
    }
  });

  navigationLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      let dataId = `n-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      landmarksArray.push(getLandmarkInfo(elem, dataId, 'navigation'));
    }
  });

  // Process the heading elements
  let headingElements = getHeadingElements();

  headingElements.forEach(function (elem) {
    if (isVisible(elem)) {
      let dataId = `h-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      headingsArray.push({
        tagName: elem.tagName.toLowerCase(),
        content: getTextContent(elem).trim(),
        dataId: dataId
      });
    }
  });

  const message = {
    id: 'menudata',
    landmarks: landmarksArray,
    headings: headingsArray
  };
  chrome.runtime.sendMessage(message);
})();
