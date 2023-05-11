// Populate the template list dropdown
document.getElementById("create").addEventListener("click", createNewTemplate);
document.getElementById("save").addEventListener("click", saveTemplate);
document.getElementById("btnImport").addEventListener("click", importTemplate);
document.getElementById("btnExport").addEventListener("click", exportTemplate);

function create() {
  var name = prompt(name);
  chrome.contextMenus.create({
    id: name,
    title: name,
    contexts: ["all"]
  });
}

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
      
      // Create a new context menu item with the template name
      chrome.contextMenus.create({
          id: name,
          title: name,
          contexts: ["all"]
      });
      
      alert("New template created successfully!");
  }
  
  // Add event listener for context menu item clicks
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
      if (info.menuItemId == name) {
          console.log(name)
      }
  });
}

function sendFillMail(name){



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
      
      // Remove the corresponding context menu item
      chrome.contextMenus.remove(name, function() {
          alert("Template deleted successfully!");
      });
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
        
        // Create a new context menu item with the imported template name
        chrome.contextMenus.create({
            id: templateName,
            title: templateName,
            contexts: ["all"]
        });
        
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



var lastActiveInput;

document.getElementById("to").addEventListener("click", function() {
  lastActiveInput = "to";
});

document.getElementById("subject").addEventListener("click", function() {
  lastActiveInput = "subject";
});

document.getElementById("message").addEventListener("click", function() {
  lastActiveInput = "message";
});
//btnCoacheEmail
document.getElementById("btnCoacheEmail").addEventListener("click", function() {
  if (lastActiveInput === "subject") {
    var input = document.getElementById("subject");
    var text = "<coachemail>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "to") {
    var input = document.getElementById("to");
    var text = "<coachemail>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "message") {
    var input = document.getElementById("message");
    var text = "<coachemail>";
    insertAtCursor(input, text);
  } 
});

document.getElementById("btnCoachname").addEventListener("click", function() {
  if (lastActiveInput === "subject") {
    var input = document.getElementById("subject");
    var text = "<coachname>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "to") {
    var input = document.getElementById("to");
    var text = "<coachname>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "message") {
    var input = document.getElementById("message");
    var text = "<coachnname>";
    insertAtCursor(input, text);
  } 
});


document.getElementById("btnUsername").addEventListener("click", function() {
  if (lastActiveInput === "subject") {
    var input = document.getElementById("subject");
    var text = "<username>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "to") {
    var input = document.getElementById("to");
    var text = "<username>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "message") {
    var input = document.getElementById("message");
    var text = "<username>";
    insertAtCursor(input, text);
  } 
});

document.getElementById("btnSessionZeit").addEventListener("click", function() {
  if (lastActiveInput === "subject") {
    var input = document.getElementById("subject");
    var text = "<sessionzeit>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "to") {
    var input = document.getElementById("to");
    var text = "<sessionzeit>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "message") {
    var input = document.getElementById("message");
    var text = "<sessionzeit>";
    insertAtCursor(input, text);
  } 
});
document.getElementById("btnTimer").addEventListener("click", function() {
  var timeInput = prompt("Please enter the time in DD:HH:MM format");
  if (timeInput !== null) {
    var timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (timeRegex.test(timeInput)) {
      var timeText = "<" + timeInput + ">";
      if (lastActiveInput === "subject") {
        var input = document.getElementById("subject");
        insertAtCursor(input, timeText);
      } else if (lastActiveInput === "to") {
        var input = document.getElementById("to");
        insertAtCursor(input, timeText);
      } else if (lastActiveInput === "message") {
        var input = document.getElementById("message");
        insertAtCursor(input, timeText);
      } 
    } else {
      alert("Invalid time format! Please enter time in DD:HH:MM format");
    }
  }
});
  

function insertAtCursor(input, text) {
  var scrollTop = input.scrollTop;
  var cursorPosition = input.selectionStart;
  var front = (input.value).substring(0, cursorPosition);
  var back = (input.value).substring(cursorPosition, input.value.length);
  input.value = front + text + back;
  cursorPosition += text.length;
  if (input.type !== "email") {
    input.selectionStart = cursorPosition;
    input.selectionEnd = cursorPosition;
  }
  input.focus();
  input.scrollTop = scrollTop;
}