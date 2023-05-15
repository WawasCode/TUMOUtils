// create other context menu items
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
// Function to handle the click event on the context menu element
function handleContextMenuClick(info, tab) {
  if (info.menuItemId === "reload_context_elements") {
    // Remove the existing template context menu elements
    chrome.contextMenus.remove("template_parent", function() {
      // Reload the template context menu elements
      createTemplateContextMenuElements();
    });
  } else {
    var templateId = info.menuItemId.replace("template_", "");
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var selectedTemplate = { templateId: templateId };
      chrome.tabs.sendMessage(tabs[0].id, { action: "fillMail", attribute: selectedTemplate });
    });
  }
}

// Function to create template context menu elements
function createTemplateContextMenuElements() {
  // Retrieve the templates from Chrome sync storage
  chrome.storage.sync.get(null, function(result) {
    var templates = Object.keys(result);
    if (templates.length === 0) {
      // No templates found
      return;
    }

    // Create a parent context menu element for templates
    chrome.contextMenus.create({
      id: "template_parent",
      title: "Templates",
      contexts: ["all"]
    });

    // Create context menu elements for each template
    templates.forEach(function(templateId) {
      var templateTitle = "Template " + templateId;
      chrome.contextMenus.create({
        id: "template_" + templateId,
        title: templateTitle,
        parentId: "template_parent",
        contexts: ["all"],
        onclick: handleContextMenuClick
      });
    });
  });
}

// Create a context menu element to reload template context menu elements
chrome.contextMenus.create({
  id: "reload_context_elements",
  title: "Reload Context Elements",
  contexts: ["all"],
  onclick: handleContextMenuClick
});