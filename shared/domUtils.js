/* domUtils.js */

function getLandmarkAccessibleName (landmark) {
  const labelledbyIds = landmark.getAttribute('aria-labelledby'),
    label = landmark.getAttribute('aria-label'),
    title = landmark.getAttribute('title');

  if (labelledbyIds && labelledbyIds.length) {
    const ids = labelledbyIds.split(' '), strings = [];

    for (const id of ids) {
      const elem = document.getElementById(id);
      if (elem) {
        const str = getTextContent(elem);
        if (str && str.length) {
          strings.push(str);
        }
      }
    }
    return strings.join(' ');
  }

  if (isNonEmptyString(label)) {
    return label;
  }

  if (isNonEmptyString(title)) {
    return title;
  }

  return '';
}

/*
**  getTextContent: called by getAccessibleName
*/
function getTextContent (elem) {

  function getTextRec (e, strings) {
    // If text node, get the text and return
    if (e.nodeType === Node.TEXT_NODE) {
      strings.push(e.data);
    }
    else {
      // If element node, traverse all child elements looking for text
      if (e.nodeType === Node.ELEMENT_NODE) {
        // If IMG or AREA element, use ALT content if defined
        let tagName = e.tagName.toLowerCase();
        if (tagName === 'img' || tagName === 'area') {
          if (e.alt) {
            strings.push(e.alt);
          }
        }
        else {
          let c = e.firstChild;
          while (c) {
            getTextRec(c, strings);
            c = c.nextSibling;
          } // end loop
        }
      }
    }
  } // end getTextRec

  let strings = [];
  getTextRec(elem, strings);
  if (strings.length) {
    return strings.join(' ');
  }
  return '';
}

function isNonEmptyString (str) {
  return typeof str === 'string' && str.length;
}

function isVisible (element) {
  function isVisibleRec (el) {
    if (el.nodeType === Node.DOCUMENT_NODE) return true;

    let computedStyle = window.getComputedStyle(el, null);
    let display = computedStyle.getPropertyValue('display');
    let visibility = computedStyle.getPropertyValue('visibility');
    let hidden = el.getAttribute('hidden');
    let ariaHidden = el.getAttribute('aria-hidden');

    if ((display === 'none') || (visibility === 'hidden') ||
        (hidden !== null) || (ariaHidden === 'true')) {
      return false;
    }
    return isVisibleRec(el.parentNode);
  }
  return isVisibleRec(element);
}
