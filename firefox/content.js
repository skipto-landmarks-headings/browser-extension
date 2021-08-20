/* content.js */

var dataAttribName = 'data-skipto';
var debug = false;

/*
**  Connect to popup script and set up listener/handler
*/
var popupPort = browser.runtime.connect({ name: 'content' });

popupPort.onMessage.addListener(messageHandler);

function messageHandler (message) {
  switch (message.id) {
    case 'storage':
      if (debug) console.log(`content: 'storage' message`);
      processPage(message.options);
      break;
    case 'skipto':
      skipToContent(message.dataId);
      break;
    case 'cleanup':
      removeDataAttributes();
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

  // Must be 'main' or 'contentinfo' landmark
  for (const selector of selectorsArray) {
    let elem = element.querySelector(selector);
    if (elem && isVisible(elem)) {
      if (debug) console.log(`target: ${elem.tagName.toLowerCase()}`);
      return elem;
    }
  }
  return element;
}

/*
**  Perform the action specified by activated menu item
*/
function skipToContent (dataId) {
  let selector = `[${dataAttribName}="${dataId}"]`;
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
      if (debug) console.log(`target: ${target.tagName.toLowerCase()} - status: ${status}`);
    }
  }
}

/*
**  getHeadingSelector: Return a CSS selector for heading levels 1
**  through 'maxLevel'. If 'mainOnly' is true, select headings only
**  if they are contained within a 'main' landmark.
*/
function getHeadingSelector (options) {
  let maxLevel = options.maxLevelIndex + 2;
  let mainOnly = options.mainOnly;
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
function getHeadingElements (options) {
  if (debug) console.log(options);
  let selector = getHeadingSelector(options);
  console.log(selector);
  return document.querySelectorAll(selector);
}

/*
**  Process the page by (1) setting the data attribute on the selected elements
**  and (2) collecting the skipTo menu data and sending it to the popup script.
*/
function processPage (options) {
  let landmarksArray = [];
  let headingsArray = [];
  let counter = 0;

  // Process the landmark elements
  let mainLandmarks = document.querySelectorAll('main, [role="main"]');
  let searchLandmarks = document.querySelectorAll('[role="search"]');
  let navigationLandmarks = document.querySelectorAll('nav, [role="navigation"]');
  let contentinfoLandmarks = document.querySelectorAll('footer, [role="contentinfo"]');

  function isDescendantOfNames (element) {
    const names = ['article', 'aside', 'main', 'nav', 'section'];
    return names.some(name => element.closest(name));
  }

  function isDescendantOfRoles (element) {
    const roles = ['article', 'complementary', 'main', 'navigation', 'region'];
    return roles.some(role => element.closest(`[role="${role}"]`));
  }

  function hasRoleContentinfo (element) {
    if (element.hasAttribute('role')) {
      if (element.getAttribute('role') === 'contentinfo') {
        return true;
      }
    }
    return !(isDescendantOfNames(element) || isDescendantOfRoles(element));
  }

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

  contentinfoLandmarks.forEach(function (elem) {
    if (isVisible(elem) && hasRoleContentinfo(elem)) {
      let dataId = `f-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      landmarksArray.push(getLandmarkInfo(elem, dataId, 'contentinfo'));
    }
  });

  // Process the heading elements
  let headingElements = getHeadingElements(options);

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

  popupPort.postMessage(message);
}

/*
**  removeDataAttributes: Prevent skipTo links from being out-of-sync
**  when user preferences/options are changed.
*/
function removeDataAttributes () {
  const dataElements = document.querySelectorAll(`[${dataAttribName}]`);
  console.log(`dataElements: ${dataElements.length}`);
  dataElements.forEach(elem => {
    elem.removeAttribute(dataAttribName);
  })
}
