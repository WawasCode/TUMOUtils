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
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const trainerElement = doc.querySelector('#w0 > tbody > tr:nth-child(7) > td > span');
        if (trainerElement) {
          const coach = trainerElement.textContent.trim();
          coaches.push(coach);
        }
      }
  
      // Remove duplicates, format coach emails and join them as comma-separated string
      const coachEmails = coaches
        .filter((coach, index, self) => self.indexOf(coach) === index)
        .map(coach => {
            // Replace umlaut characters with their respective replacements
            coach = coach.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue");
            return coach.replace(/ /g, ".").toLowerCase() + "@tumo.center";
        })
        .join(",");
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
                const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=" + coachEmails + "&su=" + encodeURIComponent(emailSubject) + "&body=" + encodeURIComponent(emailMessage);
                window.open(gmailUrl);
                } else {
                console.log("Table does not exist.");
                }
            }
        }   
                }           
  }
  
  extractCoaches();
  