# CHANGELOG

## 1.2.0 — Aug. 27, 2021

* Add 'contentinfo' landmarks (always displayed if present). Use the criteria
  defined in the W3C 'ARIA in HTML' document to determine whether an element
  has the 'contentinfo' role.
* Add 'complementary' landmarks (optionally displayed). Allow user to set this
  option in Options/Preferences (default value is 'true').
* Update 'getTargetElement' function in the 'content' script to use 'tagName'
  and/or 'role' attribute value for 'search' and 'navigation' landmarks.
* Update the layout of the Options/Preferences panel. Divide panel into two
  sections: 'Landmarks' and 'Headings', and add new option under 'Landmarks'
  section: 'Include complementary landmarks'.

## 1.1.0 — Jun. 24, 2021

* Change extension name
* Change keyboard shortcut to 'Alt+2'/'Option+2'
* Add ARIA label for heading content, including heading level
* Add option to toggle display of heading level numbers