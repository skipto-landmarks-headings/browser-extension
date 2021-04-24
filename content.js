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
    // return element.querySelector('a');
    let elements = element.querySelectorAll('a');
    for (const elem of elements) {
      if (isVisible(elem)) return elem;
    }
    return element;
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
function getHeadingSelector (maxLevel, mainOnly) {
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
  let selector = getHeadingSelector(3, false);
  console.log(selector);
  return document.querySelectorAll(selector);
}

/*
**  When this script is executed directly, extract the skipto menu
**  data and send it to the popup script.
**
**  Note: Landmarks are handled differently than headings in that when
**  the skipto function is invoked, a representative target element is
**  selected for focusing and scrolling (see skipToContent). Headings,
**  on the other hand, are used in a more direct fashion, and therefore
**  a conditional filter is applied when building the headingsArray to
**  select only visible elements.
*/
(function () {
  let landmarksArray = [];
  let headingsArray = [];
  let counter = 0;
  let dataAttribName = 'data-skipto';
  let dataId;

  // Process the landmark elements
  let mainLandmarks = document.querySelectorAll('main, [role="main"]');
  let searchLandmarks = document.querySelectorAll('[role="search"]');
  let navigationLandmarks = document.querySelectorAll('nav, [role="navigation"]');

  mainLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      dataId = `m-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);

      let landmarkInfo = {
        tagName: elem.tagName.toLowerCase(),
        ariaRole: 'main',
        accessibleName: getAccessibleName(elem),
        dataId: dataId
      }
      landmarksArray.push(landmarkInfo);
    }
  });

  searchLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      dataId = `s-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);

      let landmarkInfo = {
        tagName: elem.tagName.toLowerCase(),
        ariaRole: 'search',
        accessibleName: getAccessibleName(elem),
        dataId: dataId
      }
      landmarksArray.push(landmarkInfo);
    }
  });

  navigationLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      dataId = `n-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);

      let landmarkInfo = {
        tagName: elem.tagName.toLowerCase(),
        ariaRole: 'navigation',
        accessibleName: getAccessibleName(elem),
        dataId: dataId
      }
      landmarksArray.push(landmarkInfo);
    }
  });

  // Process the heading elements
  let headingElements = getHeadingElements();

  headingElements.forEach(function (elem) {
    if (isVisible(elem)) {
      dataId = `h-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);

      let headingInfo = {
        tagName: elem.tagName.toLowerCase(),
        content: getTextContent(elem).trim(),
        dataId: dataId
      };
      headingsArray.push(headingInfo);
    }
  });

  const message = {
    id: 'content',
    landmarks: landmarksArray,
    headings: headingsArray
  };
  browser.runtime.sendMessage(message);
})();
