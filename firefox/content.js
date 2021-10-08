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
**  getLandmarkTarget: Find the best choice among the landmark's descendants
**  for setting focus, based on the landmark's ARIA role.
*/
function getLandmarkTarget (element) {
  const selectorsArray = ['h1', 'a[href]', 'h2', 'h3', 'section', 'article', 'h4', 'h5', 'h6', 'p', 'li'];
  const role = element.hasAttribute('role') ? element.getAttribute('role') : '';
  const tagName = element.tagName.toLowerCase();
  const isSearch = (role === 'search');
  const isNavigation = (tagName === 'nav') || (role === 'navigation');

  if (isSearch) {
    return element.querySelector('input');
  }

  if (isNavigation) {
    let elements = element.querySelectorAll('a');
    for (const elem of elements) {
      if (isVisible(elem)) return elem;
    }
    return element;
  }

  // Must be 'main', 'complementary' or 'contentinfo' landmark
  for (const selector of selectorsArray) {
    let elem = element.querySelector(selector);
    if (elem && isVisible(elem)) {
      if (debug) console.log(`target: ${elem.tagName.toLowerCase()}`);
      return elem;
    }
  }
  return element;
}

function getHeadingTarget (element) {
  // First choice: anchor descendant
  const anchorDescendant = element.querySelector('a');
  if (anchorDescendant !== null) return anchorDescendant;

  // Second choice: anchor ancestor
  const anchorAncestor = element.closest('a');
  if (anchorAncestor !== null) return anchorAncestor;

  // Default: heading element
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
    target = isHeading ? getHeadingTarget(element) : getLandmarkTarget(element);
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

  // Helper functions

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
      return true; // CSS selector guarantees 'role' === 'contentinfo'
    }
    // Must be a 'footer' element without 'role' attribute
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

  // Process the landmark elements
  const mainLandmarks = document.querySelectorAll('main:not([role]), [role="main"]');
  mainLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      const dataId = `m-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      landmarksArray.push(getLandmarkInfo(elem, dataId, 'main'));
    }
  });

  const searchLandmarks = document.querySelectorAll('[role="search"]');
  searchLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      const dataId = `s-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      landmarksArray.push(getLandmarkInfo(elem, dataId, 'search'));
    }
  });

  const navigationLandmarks = document.querySelectorAll('nav:not([role]), [role="navigation"]');
  navigationLandmarks.forEach(function (elem) {
    if (isVisible(elem)) {
      const dataId = `n-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      landmarksArray.push(getLandmarkInfo(elem, dataId, 'navigation'));
    }
  });

  if (options.inclComp) {
    const complementaryLandmarks = document.querySelectorAll('aside:not([role]), [role="complementary"]');
    complementaryLandmarks.forEach(function (elem) {
      if (isVisible(elem)) {
        const dataId = `a-${++counter}`;
        elem.setAttribute(dataAttribName, dataId);
        landmarksArray.push(getLandmarkInfo(elem, dataId, 'complementary'));
      }
    });
  }

  const contentinfoLandmarks = document.querySelectorAll('footer:not([role]), [role="contentinfo"]');
  contentinfoLandmarks.forEach(function (elem) {
    if (isVisible(elem) && hasRoleContentinfo(elem)) {
      const dataId = `c-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      landmarksArray.push(getLandmarkInfo(elem, dataId, 'contentinfo'));
    }
  });

  // Process the heading elements
  const headingElements = getHeadingElements(options);
  headingElements.forEach(function (elem) {
    if (isVisible(elem)) {
      const dataId = `h-${++counter}`;
      elem.setAttribute(dataAttribName, dataId);
      headingsArray.push({
        tagName: elem.tagName.toLowerCase(),
        content: getTextContent(elem).trim(),
        dataId: dataId
      });
    }
  });

  // Send the menu data to the popup script
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
