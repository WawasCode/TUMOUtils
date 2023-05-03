chrome.contextMenus.create({
  title: "Extract Usernames",
  contexts: ["page"],
  onclick: function() {
    // execute content script
    chrome.tabs.executeScript({
      file: "content.js"
    });

    // log a message to the console
    console.log("Extract Coaches executed!");
  }
});

chrome.contextMenus.create({
  title: "Extract Coaches",
  contexts: ["page"],
  onclick: function() {
    // execute content script
    chrome.tabs.executeScript({
      file: "CoachExtractor.js"
    });

    // log a message to the console
    console.log("Extract Coaches executed!");
  }
});
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: "T360",
    contexts: ["page"],
    onclick: function() {
      chrome.tabs.create({ url: "https://360.de.tumo.world/" });
    }
  });
});
