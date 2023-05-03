async function extractCoaches() {
    // Find the table body element
    const tableBody = document.querySelector('#subscribed-users-list');
    var modal = document.getElementById("subscribed-users");
    if (tableBody) {
      // Find all the rows in the table body
      const rows = tableBody.querySelectorAll('tr');
  
      // Loop through each row and extract the username and href
      const usernames = [];
      const hrefs = [];
      rows.forEach(row => {
        const usernameElement = row.querySelector('a');
        if (usernameElement) {
          const username = usernameElement.textContent;
          const href = usernameElement.getAttribute('href');
          usernames.push(username);
          hrefs.push(href);
        }
      });
  
      // Loop through the hrefs and extract the coach name from each page
      const coaches = [];
      for (let i = 0; i < hrefs.length; i++) {
        const href = hrefs[i];
        const response = await fetch(href);
        const mailRegex = /[a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/; 
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const trainerElement = doc.querySelector('#w0 > tbody > tr:nth-child(7) > td > a');
        if (trainerElement) {
          const coach = trainerElement.getAttribute("href");
          const email = coach.match(mailRegex)[0]
          coaches.push(coach);
        }
      }
  
      // Remove duplicates, format coach emails and join them as comma-separated string
      const coachEmails = coaches
      // the substring to remove
      const substring = "https://mail.google.com/mail/?view=cm&to=";
      
      // a new array to store the emails
      const emails = [];
      
      // loop through the coaches array
      for (let i = 0; i < coaches.length; i++) {
        // remove the substring from each element and push it to the emails array
        emails.push(coaches[i].replace(substring, ""));
      }
      
      // create a Set from the emails array to filter out duplicates
      const uniqueEmails = new Set(emails)
      
      // convert the Set back to an array and log it
      console.log(Array.from(uniqueEmails));
        
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
      // Open a new window with a Gmail compose window populated with email addresses of all coaches
                const emailMessage = "Default";
                const emailSubject = workshopName;
                const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=" + Array.from(uniqueEmails).join(","); + "&su=" + encodeURIComponent(emailSubject) + "&body=" + encodeURIComponent(emailMessage);
                window.open(gmailUrl);
                } else {
                console.log("Table does not exist.");
                }
            }
        }   
                }           
  }
  
  extractCoaches();
  