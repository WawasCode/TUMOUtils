document.getElementById('saveButton').addEventListener('click', function() {
  var name = document.getElementById('nameInput').value;
  chrome.storage.sync.set({ 'name': name }, function() {
    console.log('Name saved: ' + name);
    alert('Name saved: ' + name);
  });
});
// Initialize the fusernames and busernames arrays
var fusernames = [];
var busernames = [];
var localBlacklist = [];
var coachName = "";
// Event listener for the "Freez-Email send options" section
document.getElementById('freezeFileInput').addEventListener('change', function() {
  var file = this.files[0];
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function() {
    var data = new Uint8Array(reader.result);
    var workbook = XLSX.read(data, { type: 'array' });
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Extract usernames from column A starting from A2
    for (var i = 2; ; i++) {
      var cell = worksheet['A' + i];
      if (!cell || !cell.v) {
        break;
      }
      fusernames.push(cell.v);
    }
    
    // Output fusernames array to console
    console.log(fusernames);
    
    // Remove elements from fusernames that are contained in busernames
    fusernames = fusernames.filter(function(username) {
      return !busernames.includes(username);
    });
    
    // Output filtered fusernames array to console
    console.log(fusernames);
  };
});

// Event listener for the "Import blacklist" section
document.getElementById('blacklistFileInput').addEventListener('change', function() {
  var file = this.files[0];
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function() {
    var data = new Uint8Array(reader.result);
    var workbook = XLSX.read(data, { type: 'array' });
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Extract usernames from column A starting from A2
    for (var i = 2; ; i++) {
      var cell = worksheet['A' + i];
      if (!cell || !cell.v) {
        break;
      }
      busernames.push(cell.v);
    }
   
    // Output BlackList array to console
    console.log(busernames);
    chrome.storage.sync.get('localBlacklist', function(result) {
      if (result.localBlacklist) {
        localBlacklist = result.localBlacklist;
      } else {
        chrome.storage.sync.set({ 'localBlacklist': [] });
      }
    });
    console.log(localBlacklist);
    // Append localBlacklist with elements from busernames that are not already included
    for (var i = 0; i < busernames.length; i++) {
      if (!localBlacklist.includes(busernames[i])) {
        localBlacklist.push(busernames[i]);
      }
    }
    console.log(localBlacklist);
    chrome.storage.sync.set({ 'localBlacklist': localBlacklist }, function() {
      console.log('localBlacklist updated: ' + localBlacklist);
    });

  };
  
});

document.getElementById('saveBlacklist').addEventListener('click', function() {
  var name = document.getElementById('blacklistInput').value;
  localBlacklist.push(name);
  chrome.storage.sync.set({ 'localBlacklist': localBlacklist }, function() {
    console.log('Name added: ' + name);
    alert('Name added to Blacklist: ' + name);
  });
});
function filterOutString(arr, str) {
  return arr.filter(function(value){
    return value !== str;
  });
}

document.getElementById('removeButton').addEventListener('click', function() {
  var name = document.getElementById('blackListExclude').value;
  chrome.storage.sync.get('localBlacklist', function(result) {
    if (result.localBlacklist) {
      localBlacklist = result.localBlacklist;
    } else {
      chrome.storage.sync.set({ 'localBlacklist': [] });
      localBlacklist = [];
    }
    // update the local blacklist
    localBlacklist = filterOutString(localBlacklist, name);
    chrome.storage.sync.set({ 'localBlacklist': localBlacklist }, function() {
      console.log('localBlacklist updated: ' + localBlacklist);
    });
  });
});
document.getElementById('downloadButton').addEventListener('click', function() {
  chrome.storage.sync.get('localBlacklist', function(result) {
    if (result.localBlacklist) {
      localBlacklist = result.localBlacklist;
    } else {
      chrome.storage.sync.set({ 'localBlacklist': [] });
    }
  });
  var workbook = XLSX.utils.book_new();
  var worksheet = XLSX.utils.json_to_sheet(localBlacklist.map(function(username) {
    return { username: username };
  }));
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Busernames');
  var file = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  var blob = new Blob([s2ab(file)], { type: 'application/octet-stream' });
  saveAs(blob, 'Busernames.xlsx');
});

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

// Generate an email for the selected users when the Generate Email button is clicked
document.getElementById('emailButton').addEventListener('click', function() {
  // Filter out usernames that are in the local blacklist
  const filteredUsernames = fusernames.filter(username => !localBlacklist.includes(username));

  // Create an array of email addresses from the filtered usernames
  const emailArray = filteredUsernames.map(username => username + '@tumo.world');
  
  chrome.storage.sync.get({ 'name': '' }, function(data) {
    var encodedName = data.name;
  
  // Decode the name using decodeURIComponent()
  var name = decodeURIComponent(encodedName);

  console.log('Name retrieved: ' + name);
  
  // Set the name input value to the decoded name
  coachname=nameInput.values;
  
  // TODO: Implement email generation code using emailArray
  console.log(emailArray)
  var emailSubject = "TUMO vermisst dich!";
  var emailMessage = "Hallo!\n\nDu warst schon seit einer Weile nicht mehr regelmäßig anwesend und wir haben nichts von dir gehört. Gibt es einen Grund dafür? Falls du noch eine Frage hast, oder es irgendein größeres Problem gibt, melde dich unbedingt bei mir. \nWir würden uns freuen dich wieder bei TUMO willkommen zu heißen.\n\nLiebe Grüße\nDein Coach "+name
          var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1" + "&su=" + encodeURIComponent(emailSubject) + "&body=" + encodeURIComponent(emailMessage)+ "&bcc=" + emailArray.join(",")+"&charset=UTF-8";
          window.open(gmailUrl);

        });});


  document.getElementById("templateButton").addEventListener("click", function() {
    window.open("template.html"); // Open template.html in a new window
  });




//-----------------------------------------------------------------------------------------------------------
//New Code 4 Shiela





