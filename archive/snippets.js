snippets.txt

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],


  "permissions": [
    "activeTab",
    "storage",
    "tabs",
    "<all_urls>"
  ],


  "background": {
    "scripts": ["background.js"],
    "persistent": true
  },


function onError(error) {
  console.log(`Error: ${error}`);
}


function logHeadings () {
  if (headings.length === 0) {
    console.log('No headings found!');
    return;
  }

  console.log(`length: ${headings.length}`);

  headings.forEach(function (item) {
    console.log(`${item.tag}: ${item.content}`);
  });
}
