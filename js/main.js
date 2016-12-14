/**
  RateMyCarl - Project by Alex Kim '17
  Made with <3 for Carleton Students
**/


/*
  Professor names that are exceptions on The Hub/Enroll
*/
let exceptions = {
  "Jaret McKinstry, Susan" : "Susan+Jaret-McKinstry",
  "López, Silvia" : "Silvia+Lopez",
  "Silvia López" : "Silvia+Lopez",
  "Palmar M Álvarez-Blanco" : "Palmar+Alvarez-Blanco",
  "José Cerna-Bazán" : "Jose+Cerna-Bazan",
  "Beatriz Pariente-Beltrán" : "Beatriz+Pariente-Beltran",
  "Éva S Pósfay": "Eva+Posfay"
};


/*
  Formats professors with middle names i.e. "Richard A Keiser" => "Richard Keiser"
*/
const formatProfNameWithSpace = (name) => {

  let nameArr = name.split(" ");
  let formattedProfName = nameArr[0] + "+" + nameArr[nameArr.length-1];

  return formattedProfName;
};


const processFirstRequest = (data, map, name) => {

  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = data;

  let foundProfessors = tempDiv.getElementsByClassName('listing PROFESSOR');

  if (foundProfessors.length === 0 || !foundProfessors) {
    //No search results, populate result UI with "N/A"
    console.error("No search results found for : ", name);

    throw new Error("No search results found");
  } else {
    //There is a search result, fetch professor's profile page link
      let link = foundProfessors[0].getElementsByTagName("a")[0].getAttribute("href"); //ShowRatings.jsp?tid=2108435
      let profilePageLink = "http://www.ratemyprofessors.com" + link;

      return profilePageLink;
    }
};


const processSecondRequest = (info, map, name) => {

  let gradeInfo = {
    overallQuality : "N/A",
    wouldTakeAgain : "N/A",
    difficultyRating : "N/A",
    profileLink : "¯\\_(ツ)_/¯",
    firstReview : "",
    ratingsExist : false,
    reviewsExist : false
  }

  let data = info.data;
  let profileLink = info.url;

  //replace GET request 404 error messages from RateMyProfessors.com with empty string
  data = data.replace('/assets/chilis/warm-chili.png', '');
  data = data.replace('/assets/chilis/cold-chili.png', '');
  data = data.replace('/assets/chilis/new-hot-chili.png', '');
  data = data.replace('/assets/mobileAppPromo.png', '');
  data = data.replace('assets/ok.png');

  let ratingResults = document.createElement("div");
  ratingResults.innerHTML = data;

  //select div for professor ratings
  let ratings = ratingResults.getElementsByClassName("grade");
  //May not exist yet(Reviews have not been added)
  //OR [0] : overall quality  [1] : would take again  [2] : level of difficulty

  //select div for most recent review
  let mostRecentReview = ratingResults.getElementsByClassName("commentsParagraph");

  //if there are reviews, remove newline and whitespace, populate gradeInfo with review
  if (mostRecentReview.length >= 1) {
    gradeInfo.firstReview = `"${mostRecentReview[0].innerText.trim()}"`;
    gradeInfo.reviewsExist = true;
  }

  //Reviews exist, so remove newline and whitespace, populate gradeInfo object with information
  if (ratings.length >= 3) {
    gradeInfo.overallQuality = ratings[0].innerText.replace(/\n/g, "").trim();
    gradeInfo.wouldTakeAgain = ratings[1].innerText.replace(/\n/g, "").trim();
    gradeInfo.difficultyRating = ratings[2].innerText.replace(/\n/g, "").trim();
    gradeInfo.ratingsExist = true;
  }

  //add url to gradeInfo whether there are reviews or not(Since profile page DOES exist)
  gradeInfo.profileLink = profileLink;

  //map professor name with ratings
  map.set(name, gradeInfo);

  return gradeInfo;
};


/*
  Fetches all professor names from enroll page and stores in a set
*/
const getNamesFromEnroll = (professorMap) => {

  let profNamesFromEnroll = document.getElementsByClassName("faculty");

  //change returned HTMLCollection to array
  profNamesFromEnroll = Array.from(profNamesFromEnroll);

  profNamesFromEnroll.forEach(function(facultyNode) {

    let profNames = facultyNode.innerText.split(", ");;

    //iterate over professor names, because one class can have multiple instructors
    for (let i = 0; i < profNames.length; i++) {
      let finalizedProfName = formatProfNameWithSpace(profNames[i]);

      //check if name is one of exception, if so, convert it
      if (exceptions[facultyNode.innerText]) {
        finalizedProfName = exceptions[facultyNode.innerText];
      }
      //If this is a professor that's been processed already and results exist, add to ratings
      if (professorMap.has(finalizedProfName)) {

        addRatings(professorMap.get(finalizedProfName), facultyNode, "enroll");
      } else {

        findProfessorPage(finalizedProfName)
          .then((data) => { return processFirstRequest(data, professorMap, finalizedProfName); })
            .then(fetchRatings)
              .then((data) => { return processSecondRequest(data, professorMap, finalizedProfName); })
                .then((professorInfo) => { addRatings(professorInfo, facultyNode, "enroll"); })
                  .catch( (reason) => { console.error("ERROR : ", reason); });

      }

    }

  });
};


/*
  Fetches all professor names from The Hub and stores them in a set
*/
const getNamesFromHub = (professorMap) => {

  let profNamesFromHub = document.getElementsByClassName(" SEC_FACULTY_INFO");

  //change returned HTMLCollection to array
  profNamesFromHub = Array.from(profNamesFromHub);

  //Hougen-Eitzman, David, Mitra, Raka
  //Bou Nassif, Hicham
  //Keiser, Richard

  //Add 'rating' header to The Hub Page Table
  let rows = document.getElementsByTagName("tr");
  let tableHeaders = rows[5];
  if (tableHeaders) {
    let header = document.createElement("th");
    header.innerText = 'Ratings';
    header.className += "Grp_WSS_COURSE_SECTIONS ";
    tableHeaders.append(header);
  }

  //Add column to each row
  for (let i = 6; i < rows.length-1; i++) {
    let column = document.createElement("td");
      if (i % 2 === 0) {
        column.className += "thehub oddrow";
      } else {
        column.className += "thehub evenrow";
      }
    rows[i].append(column);
  }

  profNamesFromHub.forEach(function(facultyNode) {

    //remove all commas from names and split into array
    let profNames = facultyNode.innerText.replace(/,|\n/g , "").split(" ");

    for (let i = 0; i < profNames.length; i+=2) {
      let formattedProfName = profNames[i+1] + "+" + profNames[i];

      //check if name is one of exception, if so, convert it
      let joinedProfName = profNames.join(" ");
      if (exceptions[joinedProfName]) {
        formattedProfName = exceptions[joinedProfName];
      }

      //If this is a new professor, make new request
      if (professorMap.has(formattedProfName)) {
        console.log('handling duplicates!!');
        addRatings(professorMap.get(formattedProfName), facultyNode, "hub");
      } else {

        findProfessorPage(formattedProfName)
          .then((data) => { return processFirstRequest(data, professorMap, formattedProfName); })
            .then(fetchRatings)
              .then((data) => { return processSecondRequest(data, professorMap, formattedProfName); })
                .then((data) => { addRatings(data, facultyNode, "hub"); })
                  .catch( (reason) => { console.error("Caught error for this :", reason); });
      }

    }
  });
};


/*
  Finds professor's specific profile page from initial search results
*/
const findProfessorPage = (professorName) => {
  //Our url for making initial request to find professor's profile page, change url with professor's name
  let url = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=Carleton+College&queryoption=HEADER&query=PROFESSORNAME&facetSearch=true";
  url = url.replace("PROFESSORNAME", professorName);

  let requestInfo = {
    method: 'GET',
    url: url
  };

  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage(requestInfo, function(data) {
      if (data) {
        resolve(data);
      } else {
        console.error('error in getting back data');
        reject(data);
      }
    });
  });

};


const fetchRatings = (profilePageLink) => {
  return new Promise(function(resolve, reject) {
    //make second request
      chrome.runtime.sendMessage({
        method: 'GET',
        url: profilePageLink
      }, function(data) {
        if (data) {

          //attach professor's specific page url to object so processSecondRequest can use it
          let info = {
            data: data,
            url : profilePageLink
          };

          resolve(info);
        } else {
          reject(data);
        }
      });
  });
};


const addRatings = (professorData, facultyNode, whichPage) => {

  let elements = {
    overallQuality : document.createElement("p"),
    wouldTakeAgain : document.createElement("p"),
    difficultyRating : document.createElement("p"),
    firstReview : document.createElement("p"),
    profileLink : document.createElement("a"),
  };

  for (key in elements) {
    if (key !== "profileLink") {
      let data = professorData[key];
      elements[key].innerHTML = `<span>${data}</span>`;
    }
      elements[key].className += "rateMyProfessor-rating";
  }

  //add class to firstReview so we can adjust font Size
  elements.firstReview.className += " firstReview";

  //add profile address to anchor tag, ensure it opens in new tab
  elements.profileLink.href = professorData.profileLink;
  elements.profileLink.setAttribute("target", "_blank");


  if (whichPage === "enroll") {

    elements.overallQuality.prepend(document.createTextNode("Average Rating : "));
    elements.wouldTakeAgain.prepend(document.createTextNode("Would Take Again : "));
    elements.difficultyRating.prepend(document.createTextNode("Difficulty : "));
    elements.firstReview.prepend(document.createTextNode("Most Recent Review : "));
    elements.profileLink.prepend(document.createTextNode("Read All Reviews"));

    if (!professorData.ratingsExist) {
      elements.profileLink.innerText = "Add First Review";
    }

    facultyNode.appendChild(elements.overallQuality);
    facultyNode.appendChild(elements.difficultyRating);
    facultyNode.appendChild(elements.wouldTakeAgain);

    //only append most recent review if it exists
    if (professorData.ratingsExist) {
      facultyNode.appendChild(elements.firstReview);
    }
    facultyNode.appendChild(elements.profileLink);

  } else if (whichPage === "hub") {

    //from facultyNode, walk up to parent, then get lastChild to get current cell
    let cell = facultyNode.parentNode.lastChild;
    elements.overallQuality.prepend(document.createTextNode("Avg: "));
    elements.wouldTakeAgain.prepend(document.createTextNode("WTA: "));
    elements.difficultyRating.prepend(document.createTextNode("Difficulty: "));
    elements.profileLink.prepend(document.createTextNode("Read Reviews"));

    if (!professorData.ratingsExist) {
      elements.profileLink.innerText = "Write Review";
    }

    cell.appendChild(elements.overallQuality);
    cell.appendChild(elements.difficultyRating);
    cell.appendChild(elements.wouldTakeAgain);
    cell.appendChild(elements.profileLink);
  }

};


const main = () => {

  let processedProfessorSoFar = new Map();

  //check which site we're on, and call handleEnrollPage or handleHubPage
  if (window.location.hostname === "apps.carleton.edu" && window.location.pathname === "/campus/registrar/schedule/enroll/") {
    getNamesFromEnroll(processedProfessorSoFar);
  } else if (window.location.hostname === "thehub.carleton.edu") {
    //Don't invoke on the initial search page - search page has a dropdown, whereas results page doesnt
    if (document.getElementsByTagName("select").length === 0) {
      getNamesFromHub(processedProfessorSoFar);
    }
  }
};

main();