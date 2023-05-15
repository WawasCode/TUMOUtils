// Populate the template list dropdown
var templateList = document.getElementById("templateList");
chrome.storage.sync.get(null, function(items) {
  for (var key in items) {
    var option = document.createElement("option");
    option.text = key;
    templateList.add(option);
  }
});

  document.getElementById("create").addEventListener("click", createNewTemplate);
  document.getElementById("save").addEventListener("click", saveTemplate);
  document.getElementById("btnImport").addEventListener("click", importTemplate);
  document.getElementById("btnExport").addEventListener("click", exportTemplate);
  templateList.addEventListener("change", function() {
    loadTemplate(this.value);
});
document.getElementById("emailForm").addEventListener("submit", sendEmail);
  document.getElementById("sendEmailBtn").addEventListener("click", sendEmail);

// Add event listeners
document.getElementById("deleteTemplateBtn").addEventListener("click", function() {
  var selectedOption = templateList.options[templateList.selectedIndex];
  if (selectedOption != null) {
      var name = selectedOption.text;
      chrome.storage.sync.remove(name, function() {
          // Remove the corresponding context menu item
          chrome.contextMenus.remove(name, function() {
              // Remove the option from the dropdown list
              templateList.remove(templateList.selectedIndex);
              alert("Template deleted successfully!");
          });
      });
  }
});






function create() {
  var name = prompt(name);
  chrome.contextMenus.create({
    id: name,
    title: name,
    contexts: ["all"]
  });
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
  
  // Save the template in Chrome storage
  var storageObj = {};
  storageObj[selectedOption] = template;
  chrome.storage.sync.set(storageObj, function() {
    alert("Template saved successfully!");
  });
}


function loadTemplate(name) {
  chrome.storage.sync.get(name, function(items) {
    var template = items[name];
    if (template != null) {
        document.getElementById("to").value = template.to;
        document.getElementById("subject").value = template.subject;
        document.getElementById("message").value = template.message;
        alert("Template loaded successfully!");
    } else {
        alert("Template not found!");
    }
  });
}


// Add an event listener to the template list dropdown


// Create a new template
function generateContext(name, func) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = tabs[0].url;
    if (url && url.includes("https://360.de.tumo.world/")) { // check if URL matches the desired pattern
      var menuItem = chrome.contextMenus.create({
        id: name,
        title: name,
        contexts: ["page", "selection"],
        onclick: function(info, tab) {
          console.log("Context menu item clicked: " + info.menuItemId);
          func; // call the specified function
        }
      });
    }
  });
}



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
 function fillTemplate(tab, template) {
  console.log("hi")
  try {
    // get the HTML table element by its ID
    const table = document.getElementById("w0");
    if (!table) {
      throw new Error("Table not found");
    }
    
    // get the table rows as an array
    const rows = Array.from(table.getElementsByTagName("tr"));

    // initialize variables
    let usermail = "";
    let username = "";
    let coachName = "";
    let coachEmail = "";
    let sessionZeit = "";

    // loop through the rows and extract the information
    rows.forEach((row) => {
      const cells = row.getElementsByTagName("td");
      if (cells.length === 2) {
        const label = row.getElementsByTagName("th")[0].textContent.trim();
        const value = cells[0].textContent.trim();

        switch (label) {
          case "Vollständiger Name":
            username = value;
            break;
          case "TUMO-ID":
            usermail = value + "@tumo.world";
            break;
          case "Trainer":
            coachName = value.trim();
            coachEmail = row.querySelector("a")?.href.split(":")[1];
            break;
          case "sl-session":
            sessionZeit = cells[0].innerHTML.trim().replace(/<br>/g, "\n");
            break;
          default:
            break;
        }
      }
    });

    // print the extracted information to the console
    console.log("Username: ", username);
    console.log("Usermail: ", usermail);
    console.log("Coach Name: ", coachName);
    console.log("Coach Email: ", coachEmail);
    console.log("Session Zeit: ", sessionZeit);

    // replace placeholders in the email template with the extracted information
    let body = template.message.replace(/<username>/g, username);
    body = body.replace(/<coachnname>/g, coachName);
    body = body.replace(/<coachemail>/g, coachEmail);
    body = body.replace(/<sessionzeit>/g, sessionZeit);

    // open the email client with the filled template
    chrome.tabs.update(tab.id, {active: true}, function() {
      window.open(`mailto:${template.to}?subject=${template.subject}&body=${encodeURIComponent(body)}`);
    });
  } catch (error) {
    console.error(error);
    // handle the error here, e.g. show an error message to the user
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
        chrome.storage.sync.set({ [templateName]: json }, function() {
          var option = document.createElement("option");
          option.text = templateName;
          templateList.add(option);
          templateList.value = templateName;
          
    
          
          alert("Template imported successfully!");
        });
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
  
  chrome.storage.sync.get(templateName, function(result) {
    var template = result[templateName];
    var data = JSON.stringify(template);
    var blob = new Blob([data], { type: "application/json" });
    saveAs(blob, templateName + ".json");
  });
}




var lastActiveInput;
try{
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
    var text = "<coachname>";
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
document.getElementById("btnUserEmail").addEventListener("click", function() {
  if (lastActiveInput === "subject") {
    var input = document.getElementById("subject");
    var text = "<usermail>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "to") {
    var input = document.getElementById("to");
    var text = "<usermail>";
    insertAtCursor(input, text);
  } else if (lastActiveInput === "message") {
    var input = document.getElementById("message");
    var text = "<usermail>";
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
  
}
catch(e)
{ 
  console.log("no buttons here")
}
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