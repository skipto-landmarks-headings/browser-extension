About this extension:

## Overview

"Skip to Landmarks and Headings" extends the [Chrome/Firefox] browser by identifying and providing navigation to the ARIA landmark regions and HTML section headings (h1–h6) of a web page. The extension provides a menu divided into two groups: (1) the important landmark regions and (2) an outline of the heading structure of the page.

The keyboard shortcut for opening the menu is alt+2 (option+2 on macOS) and cursors keys can be used to navigate the menu. Activating a menu item scrolls the item into view and moves keyboard focus to the corresponding section of the page.

"Skip to Landmarks and Headings" provides a means for people using the keyboard to efficiently navigate to specific content on the page. The outline of headings provides an easy way for people to view the topics on a web page without having to scroll through the entire page.

## Keyboard Shortcuts

To open the "Skip To" menu using the keyboard, press 'alt+2' ('option+2' on macOS).

You can move through the menu items by pressing the following keys:

* arrow down, arrow up: step through the items one at a time
* page down, page up: move eight items forward or backward
* home, end: move to first or last item
* m: move to 'main' landmark
* n: next 'navigation' landmark
* s: next 'search' landmark
* a: next 'complementary' landmark
* c: next 'contentinfo' landmark
* 1, 2, 3, 4, 5, 6: next heading of that level

## Options/Preferences

### Landmarks

By default, "Skip To" displays 'main', 'search', 'navigation' and 'contentinfo' landmarks when found on the page. In addition to these, the "Skip To" Preferences form provides an option for toggling on or off the inclusion of 'complementary' landmarks.

### Headings

1. The "Skip To" Preferences allow the user to configure the number of heading levels used to create the headings outline. The benefit of limiting the heading levels is to make the outline shorter and easier to scan for topics of interest.

2. Also in Preferences is an option for toggling on or off the display of heading level numbers, which are added as a prefix to the heading text content.

3. Finally, there is an additional option to limit the list of headings to only those contained within the 'main' landmark region. In well structured pages, the 'main' region contains the most important information on the page; limiting headings to the 'main' region makes it easier to identify topics of interest by filtering out headings in other parts of the page.

## Keyboard Navigation and WCAG Bypass Blocks

The "Skip To" extension implements a long standing browser accessibility requirement to implement keyboard navigation to landmark regions and section headings based on the W3C WCAG Success Criteria 2.4.1 "Bypass Blocks" requirement and the W3C UAAG Requirement 9.9 "Structured Navigation".

Many people with disabilities cannot use a mouse or touchpad to navigate the content of a web page and they typically rely on only using the keyboard for operating the browser. However, the built-in keyboard support in browsers is limited to the Tab key for navigating to links and form controls.

The "Skip To" extension adds additional keyboard support for navigating the landmarks and heading structure using the keyboard, a major improvement for accessing the non-interactive content of a page.

## Heading Outline

The "Skip To" menu includes an outline of the heading structure of a page for all users to view and use for page navigation. The outline provides a convenient way for users to get an overview the content of a page without having to scroll through the entire page.

The outline makes the actual sections and subsections of the page visible, which is often difficult to see when just viewing the graphical rendering of a portion of a web page. It also provides an easy way for web page authors to check the heading structure of their page to make sure they have properly identified the section and subsection topics on the page.

## Benefits to Screen Reader Users

Screen readers have built-in functions to separately view the landmark regions and headings of a page, but the "Skip To" extension provides additional benefits. By providing a unified and filtered list of the most frequently used landmark regions and top level headings, the screen reader user has access to much shorter lists of items to read in order to get to the most important parts of the page.

## What are ARIA Landmark Regions?

Many designers, developers and people browsing the web are not familiar with ARIA landmark regions, but they are a powerful way to make web pages more accessible by identifying the layout and organization of a page for users of screen readers who cannot see the graphical rendering.

Some HTML elements such as 'main', 'nav', 'aside', 'header' and 'footer' define landmark regions automatically. Because of these automatic definitions, it is important for web designers and developers to understand how to create and use landmark regions to ensure they are meaningful and useful to users of screen readers.
