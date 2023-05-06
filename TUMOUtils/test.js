// // Populate the template list dropdown
// var draggable = document.getElementById("draggable");

// draggable.addEventListener("dragstart", function(event) {
// 	event.dataTransfer.setData("text/plain", null);
// });

// document.addEventListener("dragover", function(event) {
// 	event.preventDefault();
// });

// document.addEventListener("drop", function(event) {
// 	event.preventDefault();
// 	var x = event.clientX;
// 	var y = event.clientY;
// 	draggable.style.top = (y - draggable.offsetHeight/2) + "px";
// 	draggable.style.left = (x - draggable.offsetWidth/2) + "px";
// });


var templateList = document.getElementById("templateList");
for (var i = 0; i < localStorage.length; i++) {
	var key = localStorage.key(i);
	var option = document.createElement("option");
	option.text = key;
	templateList.add(option);
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
        document.getElementById("subject").value = "";
        document.getElementById("message").value = "";
        
        // Add the new template name to the dropdown list
        var templateList = document.getElementById("templateList");
        var option = document.createElement("option");
        option.text = name;
        templateList.add(option);
        templateList.value = name;
        
        alert("New template created successfully!");
    }
}

document.getElementById("deleteTemplateBtn").addEventListener("click", function() {
	var selectedOption = templateList.options[templateList.selectedIndex];
	if (selectedOption != null) {
		var name = selectedOption.text;
		localStorage.removeItem(name);
		templateList.remove(templateList.selectedIndex);
		alert("Template deleted successfully!");
	}
});
