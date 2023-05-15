chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("message resived")
  if (message.action === "fillMail") {
    var templateId = message.attribute.templateId;
    fillMail(templateId);
  }
});
// Function to open Gmail compose window with pre-filled template
function openGmailCompose(to, subject, message) {
  var mailUrl = "https://mail.google.com/mail/?view=cm&to=" + encodeURIComponent(to) + "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
  window.open(mailUrl, "_blank");
}

// Function to fill the mail using the template ID
function fillMail(templateId) {
  // Retrieve the template from Chrome storage using the template ID
  chrome.storage.sync.get(templateId, function(result) {
    var template = result[templateId];
    if (template) {
      // Extract information from the table on the website
      var username = document.querySelector("#w0 tr:nth-child(2) td").textContent.trim();
      var usermail = document.querySelector("#w0 tr:nth-child(10) span").textContent.trim();
      var coachName = document.querySelector("#w0 tr:nth-child(7) span").textContent.trim();
      var coachEmail = document.querySelector("#w0 tr:nth-child(7) a").href;
      var sessionZeit = document.querySelector("#w0 tr:nth-child(6) div.alert-success").textContent.trim();

      // Get the fields from the template
      var to = template.to;
      var subject = template.subject;
      var message = template.message;
      const mailRegex = /[a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/;
      coachEmail = coachEmail.match(mailRegex)[0];

      // Replace placeholders with extracted values
      to = to.replace(/<username>/g, username);
      to = to.replace(/<coachname>/g, coachName);
      to = to.replace(/<coachemail>/g, coachEmail);
      to = to.replace(/<sessionzeit>/g, sessionZeit);
      to = to.replace(/<usermail>/g, usermail);
      subject = subject.replace(/<usermail>/g, usermail);
      subject = subject.replace(/<username>/g, username);
      subject = subject.replace(/<coachname>/g, coachName);
      subject = subject.replace(/<coachemail>/g, coachEmail);
      subject = subject.replace(/<sessionzeit>/g, sessionZeit);
      message = message.replace(/<username>/g, username);
      message = message.replace(/<usermail>/g, usermail);
      message = message.replace(/<coachname>/g, coachName);
      message = message.replace(/<coachemail>/g, coachEmail);
      message = message.replace(/<sessionzeit>/g, sessionZeit);

      // Open new window with Gmail and pre-filled template
      openGmailCompose(to, subject, message);

      // Display a success message or perform any other desired action
      console.log("Mail filled successfully!");
    } else {
      alert("Template not found!");
    }
  });
}







//-----------------------------------------------------------------------------------------------------




chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.message === "extractUsernames") {
    // execute code to extract usernames
  }
});

// Get the modal dialog element with the ID "subscribed-users"
var modal = document.getElementById("subscribed-users");
var storage = chrome.storage.local;
var yeet;
chrome.storage.sync.get({ 'name': '' }, function(data) {
  var name = data.name;
  console.log('Name retrieved: ' + name);


// Check if the modal dialog exists
if (modal) {
  // Get the modal header element
  var header = modal.querySelector(".modal-header");

  // Check if the modal header element exists
  if (header) {
    // Get the workshop name and start date from the header text
    var headerText = header.querySelector("h3").textContent;
    console.log(headerText)
    var matches = headerText.match(/Users in (.+),\s+(.+),\s+(.+),\s+(.+)/);

    if (matches) {
      var workshopName = matches[1];
      
      
      
      var TempworkshopDate = matches[3].split(" ");
      const dateMap = new Map();
      dateMap.set("Jan","01");
      dateMap.set("Feb","02");
      dateMap.set("Mar","03");
      dateMap.set("Apr","04");
      dateMap.set("May","05");
      dateMap.set("Jun","06");
      dateMap.set("Jul","07");
      dateMap.set("Aug","08");
      dateMap.set("Sep","09");
      dateMap.set("Oct","10");
      dateMap.set("Nov","11");
      dateMap.set("Dec","12");
      
      var workshopDate = TempworkshopDate[1] +"."+ dateMap.get(TempworkshopDate[0]);      
      
      const sessionMap = new Map();
      
      sessionMap.set("Mon 16:00", "Montag 16-18 Uhr und Freitag 18-20 Uhr");
      sessionMap.set("Mon 18:00","Montag 18-20 Uhr und Freitag 16-18 Uhr" );
      sessionMap.set("Tue 16:00", "Dienstag 16-18 Uhr und Samstag 16-18 Uhr");
      sessionMap.set("Tue 18:00", "Dienstag 18-20 Uhr und Donnerstag 16-18 Uhr");
      sessionMap.set("Wed 16:00", "Mittwoch 16-18 Uhr und Samstag 10-12 Uhr");
      sessionMap.set("Wed 18:00", "Mittwoch 18-20 Uhr und Samstag 12-14 Uhr");
      sessionMap.set("Thu 18:00", "Donnerstag 18-20 Uhr und Samstag 14-16 Uhr");
      
      sessionMap.set("Fri 18:00", "Montag 16-18 Uhr und Freitag 18-20 Uhr");
      sessionMap.set("Fri 16:00","Montag 18-20 Uhr und Freitag 16-18 Uhr" );
      sessionMap.set("Sat 16:00", "Dienstag 16-18 Uhr und Samstag 16-18 Uhr");
      sessionMap.set("Thu 16:00", "Dienstag 18-20 Uhr und Donnerstag 16-18 Uhr");
      sessionMap.set("Sat 10:00", "Mittwoch 16-18 Uhr und Samstag 10-12 Uhr");
      sessionMap.set("Sat 12:00", "Mittwoch 18-20 Uhr und Samstag 12-14 Uhr");
      sessionMap.set("Sat 14:00", "Donnerstag 18-20 Uhr und Samstag 14-16 Uhr");
      
      const firstSessionMap = new Map();
      firstSessionMap.set("Mon 16:00", "Montag");
      firstSessionMap.set("Mon 18:00","Montag" );
      firstSessionMap.set("Tue 16:00", "Dienstag");
      firstSessionMap.set("Tue 18:00", "Dienstag");
      firstSessionMap.set("Wed 16:00", "Mittwoch");
      firstSessionMap.set("Wed 18:00", "Mittwoch");
      firstSessionMap.set("Thu 18:00", "Donnerstag");
      
      firstSessionMap.set("Fri 18:00", "Freitag");
      firstSessionMap.set("Fri 16:00","Freitag" );
      firstSessionMap.set("Sat 16:00", "Samstag");
      firstSessionMap.set("Thu 16:00", "Dienstag");
      firstSessionMap.set("Sat 10:00", "Samstag");
      firstSessionMap.set("Sat 12:00", "Samstag");
      firstSessionMap.set("Sat 14:00", "Samstag");
      var workshopSessions = sessionMap.get(matches[2]);
      var workshopFirstDay = firstSessionMap.get(matches[2]);
      var wokshopEnd = prompt("Wann endet der workshop? (DD.MM bsp. 02.09)");
      
      var test1 = "Watsche";
      // Create the email message
      var emailMessage = "Hey :D!\n\nDu bist angemeldet für den " + workshopName + " Workshop. Hier bekommst du nochmal als Überblick die wichtigsten Informationen zu deinem Workshop:\n\nZeiten: Der Workshop findet vom " + workshopDate + " bis zum "+wokshopEnd+" statt, jeweils " + workshopSessions + ". Deine Teilnahme an allen Workshopzeiten ist absolut notwendig, genauso wie, dass du immer pünktlich in die Sessions kommst. \n\n Solltest du aus wichtigen Gründen einmal nicht dabei sein können, gib mir bitte vorab Bescheid, sodass ich dich entschuldigen kann. Du kannst dafür z.B. einfach auf diese E-Mail antworten. Wenn du am "+ workshopFirstDay+" zum Workshop kommst, wird dir gesagt, in welchen Raum du musst. Du musst nichts extra mitbringen. Ich freue mich auf dich!\n\nLiebe Grüße\n"+name;

      // Get the table element with the ID "subscribed-users-list"
      var table = document.getElementById("subscribed-users-list");

      // Check if the table exists
      if (table) {
        // Get all the rows in the table
        var rows = table.getElementsByTagName("tr");

        // Create an array to store the email addresses
        var emailAddresses = [];

        // Loop through the rows and extract the email addresses
        for (var i = 0; i < rows.length; i++) {
          // Check if the row has the class "subscription-item subscription-approved pass- attendance-unmarked"
          if (rows[i].classList.contains("subscription-item", "subscription-approved", "pass-", "attendance-unmarked")) {
            // Get the full name element
            var fullNameElement = rows[i].querySelector(".full_name a");

            // Check if the full name element exists
            if (fullNameElement) {
              // Get the email address from the full name element and add "@tumo.world"
              var emailAddress = fullNameElement.textContent.trim() + "@tumo.world";

              // Add the email address to the array
              emailAddresses.push(emailAddress);
            }
          }
        }
        
        // Open a new tab with Gmail and pre-fill the email addresses and the email message
        var emailSubject = "Workshop "+workshopName +" am "+ workshopDate;
        var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=" + emailAddresses.join(",")+ "&su=" + encodeURIComponent(emailSubject) + "&body=" + encodeURIComponent(emailMessage);
        window.open(gmailUrl);
      } else {
        console.log("Table does not exist.");
      }
    } else {
      console.log("Could not extract workshop name and start");
    }
  }
}
});
