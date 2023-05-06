// Populate the template list dropdown
var templateList = document.getElementById("templateList");
for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var option = document.createElement("option");
    option.text = key;
    templateList.add(option);
}
document.getElementById("sendEmailBtn").addEventListener("click", function() {
	// Get the recipient's email address, subject, and message
	var to = document.getElementById("to").value;
	var subject = document.getElementById("subject").value;
	var message = document.getElementById("message").value;
  
	// Construct the email link with the recipient's email address, subject, and message
	var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1" +
	  "&to=" + encodeURIComponent(to) +
	  "&su=" + encodeURIComponent(subject) +
	  "&body=" + encodeURIComponent(message);
  
	// Open the email link in a new tab/window
	window.open(gmailUrl, "_blank");
  });
  
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

// Send email
function sendEmail() {
    var to = document.getElementById("to").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    // replace <username> with "Charly" and <YourName> with "Bob"
    message = message.replace("<username>", "Charly").replace("<YourName>", "Bob");

    var emailSubject = subject;
    var emailMessage = message;
    var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1" + "&to=" + encodeURIComponent(to) + "&su=" + encodeURIComponent(emailSubject) + "&body=" + encodeURIComponent(emailMessage) + "&bcc=";

    window.open(gmailUrl);
}

// Add event listeners
document.getElementById("sendEmailBtn").addEventListener("click", sendEmail);
document.getElementById("deleteTemplateBtn").addEventListener("click", function() {
    var selectedOption = templateList.options[templateList.selectedIndex];
    if (selectedOption != null) {
        var name = selectedOption.text;
        localStorage.removeItem(name);
        templateList.remove(templateList.selectedIndex);
        alert("Template deleted successfully!");
    }
});
