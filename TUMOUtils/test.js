// Populate the template list dropdown
var templateList = document.getElementById("templateList");
for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var option = document.createElement("option");
    option.text = key;
    templateList.add(option);
}
function replacePlaceholders() {
	let messageInput = document.getElementById("message");
	let message = messageInput.value;
	let placeholders = message.match(/<\w+>/g);
  
	if (placeholders) {
	  for (let placeholder of placeholders) {
		let name = placeholder.slice(1, -1);
		let placeholderBox = `<div style="background-color: #0077be; color: white; padding: 5px; margin: 5px; display: inline-block;">${name}</div>`;
		message = message.replace(placeholder, placeholderBox);
	  }
	  messageInput.innerHTML = message;
	}
  }
  
  
  
// Save the template
function saveTemplate() {
    var selectedOption = document.getElementById("templateList").value;
    if (selectedOption == "") {
        alert("Please select a template from the dropdown list first.");
        return;
    }
    
    var to = document.getElementById("to").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;
    var template = {to: to, subject: subject, message: message};
    localStorage.setItem(selectedOption, JSON.stringify(template));
    
    alert("Template saved successfully!");
}

// Load a template
function loadTemplate(name) {
    var template = JSON.parse(localStorage.getItem(name));
    if (template != null) {
        document.getElementById("to").value = template.to;
        document.getElementById("subject").value = template.subject;
        document.getElementById("message").value = template.message;
        alert("Template loaded successfully!");
    } else {
        alert("Template not found!");
    }
}

// Add an event listener to the template list dropdown
templateList.addEventListener("change", function() {
    loadTemplate(this.value);
});

// Create a new template
function createNewTemplate() {
    var name = prompt("Enter a name for the new template:");
    if (name != null && name != "") {
        // Clear the form fields
        document.getElementById("to").value = "";
        document.getElementById("subject").value = "";
        document.getElementById("message").value = "";
        
        // Add the new template name to the dropdown list
        var option = document.createElement("option");
        option.text = name;
        templateList.add(option);
        templateList.value = name;
        
        alert("New template created successfully!");
    }
}

function sendEmail(event) {
	event.preventDefault();
	var to = document.getElementById("to").value;
	var subject = document.getElementById("subject").value;
	var message = document.getElementById("message").value;
	var username = "Charly"
	var myname = "Bozo"
	// Replace placeholders with actual values
	message = message.replace(/<username>/g, username).replace(/<YourName>/g, myname);
	
	// Send email using Gmail API
	var emailSubject = subject;
	var emailMessage = message;
	var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1" + "&to=" + encodeURIComponent(to) + "&su=" + encodeURIComponent(emailSubject) + "&body=" + encodeURIComponent(emailMessage);
	window.open(gmailUrl);
}

document.getElementById("emailForm").addEventListener("submit", sendEmail);




  document.getElementById("sendEmailBtn").addEventListener("click", sendEmail);
  

  

// Add event listeners
document.getElementById("deleteTemplateBtn").addEventListener("click", function() {
    var selectedOption = templateList.options[templateList.selectedIndex];
    if (selectedOption != null) {
        var name = selectedOption.text;
        localStorage.removeItem(name);
        templateList.remove(templateList.selectedIndex);
        alert("Template deleted successfully!");
    }
});
function importTemplate() {
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";

  fileInput.onchange = function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function() {
      var json = reader.result;
      var template = JSON.parse(json);
      
      var templateName = prompt("Enter a name for the imported template:");
      if (templateName !== null && templateName !== "") {
        localStorage.setItem(templateName, json);
        
        var option = document.createElement("option");
        option.text = templateName;
        templateList.add(option);
        templateList.value = templateName;
        
        alert("Template imported successfully!");
      }
    };
    
    reader.readAsText(file);
  };

  fileInput.click();
}


function exportTemplate() {
  var templateName = document.getElementById("templateList").value;
  if (!templateName) {
    alert("Please select a template to export.");
    return;
  }
  var template = JSON.parse(localStorage.getItem(templateName));
  var data = JSON.stringify(template);
  var blob = new Blob([data], { type: "application/json" });
  saveAs(blob, templateName + ".json");
}


// Get references to the buttons and text area
// Add event listeners for the buttons
document.getElementById("btnUsername").addEventListener("click", function() {
  insertAtCursor(document.getElementById("subject"), "<username>");
  insertAtCursor(document.getElementById("to"), "<username>");
});

document.getElementById("btnCoachname").addEventListener("click", function() {
  insertAtCursor(document.getElementById("subject"), "<coachname>");
  insertAtCursor(document.getElementById("to"), "<coachname>");
});

document.getElementById("btnCoacheEmail").addEventListener("click", function() {
  insertAtCursor(document.getElementById("subject"), "<coacheemail>");
  insertAtCursor(document.getElementById("to"), "<coacheemail>");
});

document.getElementById("btnSessionZeit").addEventListener("click", function() {
  insertAtCursor(document.getElementById("subject"), "<sessionzeit>");
  insertAtCursor(document.getElementById("to"), "<sessionzeit>");
});

document.getElementById("btnTimer").addEventListener("click", function() {
  var timer = prompt("Enter time (DD:HH:MM): ");
  if (timer) {
    insertAtCursor(document.getElementById("subject"), "<" + timer + ">");
    insertAtCursor(document.getElementById("to"), "<" + timer + ">");
  }
});


// Function to insert text at the cursor position in the text area
function insertAtCursor(element, text) {
  var cursorPosition = element.selectionStart;
  var currentValue = element.value;
  var newValue = currentValue.slice(0, cursorPosition) + text + currentValue.slice(cursorPosition);

  element.value = newValue;
  element.selectionStart = cursorPosition + text.length;
  element.selectionEnd = cursorPosition + text.length;
}
