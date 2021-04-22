/* domUtils.js */

function getAccessibleName (landmark) {
  const labelledbyIds = landmark.getAttribute('aria-labelledby'),
    label = landmark.getAttribute('aria-label'),
    title = landmark.getAttribute('title');

  if (labelledbyIds && labelledbyIds.length) {
    let ids = labelledbyIds.split(' '), strings = [];
    if (!ids.length) ids = [labelledbyIds]; // is this necessary?

    ids.forEach(id => {
      let elem = document.getElementById(id);
      if (elem) {
        let text = getTextContent(elem);
        if (text & text.length) {
          strings.push(text);
        }
      }
    });
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

  function getText (e, strings) {
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
            getText(c, strings);
            c = c.nextSibling;
          } // end loop
        }
      }
    }
  } // end getStrings

  // Create return object
  let str = 'Test',
    strings = [];
  getText(elem, strings);
  if (strings.length) {
    str = strings.join(' ');
  }
  return str;
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
