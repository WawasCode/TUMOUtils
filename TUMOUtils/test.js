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
document.getElementById("btnExport").addEventListener("click", exportTemplate);

function exportTemplates() {
    var templates = {};
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var template = JSON.parse(localStorage.getItem(key));
        templates[key] = template;
    }
    var filename = "templates.json";
    var file = new Blob([JSON.stringify(templates)], {type: "application/json"});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}


function importTemplates() {
  var fileInput = document.createElement('input');
  fileInput.type = 'file';

  fileInput.addEventListener('change', function(e) {
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        var templates = data.templates;

        for (var i = 0; i < templates.length; i++) {
          var name = templates[i].name;
          var existingTemplate = localStorage.getItem(name);

          if (existingTemplate) {
            var replace = confirm('A template with the name "' + name + '" already exists. Do you want to replace it?');

            if (!replace) {
              name += ' Copy';
            }
          }

          var template = {to: templates[i].to, subject: templates[i].subject, message: templates[i].message};
          localStorage.setItem(name, JSON.stringify(template));
        }

        alert('Templates imported successfully!');
      } catch (err) {
        alert('Error importing templates: ' + err);
      }
    };

    reader.readAsText(file);
  });

  fileInput.click();
}

