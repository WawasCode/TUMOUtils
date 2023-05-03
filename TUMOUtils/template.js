// JavaScript code for template.html

// Get dropdown button, dropdown content, import button, and export button elements
var dropdownBtn = document.getElementById("dropdownBtn");
var dropdownContent = document.getElementById("dropdownContent");
var btnImport = document.getElementById("btnImport");
var btnExport = document.getElementById("btnExport");

// Add click event listener to dropdown button
dropdownBtn.addEventListener("click", function() {
  // Toggle display of dropdown content
  if (dropdownContent.style.display === "none") {
    dropdownContent.style.display = "block";
  } else {
    dropdownContent.style.display = "none";
  }
});

// Add click event listener to import button
btnImport.addEventListener("click", function() {
  // Add your import logic here
  console.log("Import button clicked");
});

// Add click event listener to export button
btnExport.addEventListener("click", function() {
  // Add your export logic here
  console.log("Export button clicked");
});

// Add click event listener to "Create New" option
var createNewTemplateOption = document.createElement("a");
createNewTemplateOption.textContent = "Create New";
createNewTemplateOption.addEventListener("click", function() {
    // Prompt the user to enter a name for the new template
    var templateName = prompt("Enter the name for the new template:");
    if (templateName) {
      // Create a new dropdown menu item with the entered name
      var newTemplateOption = document.createElement("a");
      newTemplateOption.textContent = templateName;
      // Add event listener for click event on the new dropdown menu item
      newTemplateOption.addEventListener("click", function() {
        // Update the dropdown button text with the selected template name
        dropdownBtn.textContent = templateName;
        // Hide the dropdown content
        dropdownContent.style.display = "none";
      });
      // Append the new dropdown menu item to the dropdown content
      dropdownContent.insertBefore(newTemplateOption, createNewTemplateOption);
      // Update the dropdown button text with the selected template name
      dropdownBtn.textContent = templateName;
      // Hide the dropdown content
      dropdownContent.style.display = "none";
      // Trigger a click event on the new dropdown menu item to automatically switch to the newly created template
      newTemplateOption.click();
    }
  });
  

// Append the "Create New" option to the dropdown content
dropdownContent.appendChild(createNewTemplateOption);

// Get all the dropdown menu items
var dropdownItems = dropdownContent.getElementsByTagName("a");

// Add event listener for click event on dropdown menu items
for (var i = 0; i < dropdownItems.length; i++) {
  dropdownItems[i].addEventListener("click", function() {
    // Get the text content of the clicked dropdown menu item
    var templateName = this.textContent;
    // Update the dropdown button text with the selected template name
    dropdownBtn.textContent = templateName;
    // Hide the dropdown content
    dropdownContent.style.display = "none";
  });
}

// Add event listener to window object to detect clicks outside of the dropdown
window.addEventListener("click", function(event) {
  // If the clicked element is not inside the dropdown, hide the dropdown content
  if (!event.target.matches("#dropdownBtn") && !event.target.matches("#dropdownContent")) {
    dropdownContent.style.display = "none";
  }
});

// JavaScript code for template.html

// Check if the "emailInput" element exists
var emailInput = document.getElementById("emailInput");
if (emailInput) {
  // Add event listener for input event on email input element
  emailInput.addEventListener("input", function() {
    // Get the current selected template from the dropdown button
    var selectedTemplate = document.getElementById("dropdownBtn").textContent;
    // Save the email input value to localStorage with the selected template as the key
    localStorage.setItem(selectedTemplate, emailInput.value);
  });

  // Add event listener for DOMContentLoaded event to load the email input value for the initial template
  document.addEventListener("DOMContentLoaded", function() {
    // Get the initial selected template from the dropdown button
    var selectedTemplate = document.getElementById("dropdownBtn").textContent;
    // Load the email input value from localStorage using the selected template as the key
    emailInput.value = localStorage.getItem(selectedTemplate);
  });
}
