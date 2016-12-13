/**
  RateMyCarl - Project by Alex Kim '17
  Made with <3 for Carleton Students
**/

/*
  Formats professors with middle names i.e. "Richard A Keiser" => "Richard Keiser"
*/
const formatProfNameWithSpace = (name) => {

  let nameArr = name.split(" ");
  let formattedProfName = nameArr[0] + "+" + nameArr[nameArr.length-1];

  return formattedProfName;
};

/*
  Fetches all professor names from enroll page and stores in a set
*/
const getNamesFromEnroll = () => {

  let profNamesFromEnroll = document.getElementsByClassName("faculty");

  //change returned HTMLCollection to array
  profNamesFromEnroll = Array.from(profNamesFromEnroll);

  //add all profNames from enroll page to set to handle duplicates
  profNamesFromEnroll.forEach(function(facultyNode) {

    let profNames = facultyNode.innerText.split(", ");

    for (let i = 0; i < profNames.length; i++) {
      let finalizedProfName = formatProfNameWithSpace(profNames[i]);
      findProfessorPage(finalizedProfName);
    }

  });
};


/*
  Fetches all professor names from The Hub and stores them in a set
*/
const getNamesFromHub = () => {

  let profNamesFromHub = document.getElementsByClassName(" SEC_FACULTY_INFO");

  //change returned HTMLCollection to array
  profNamesFromHub = Array.from(profNamesFromHub);

  //Hougen-Eitzman, David, Mitra, Raka
  //Bou Nassif, Hicham
  //Keiser, Richard

  profNamesFromHub.forEach(function(facultyNode) {

    //remove all commas from names and split into array
    let profNames = facultyNode.innerText.replace(/,|\n/g , "").split(" ");

    for (let i = 0; i < profNames.length; i+=2) {
      let formattedProfName = profNames[i+1] + "+" + profNames[i];
      //get ratings from findProfessorPage
      findProfessorPage(formattedProfName);
      //
    }
  });

  return profNameSet;
};


/*
  Finds professor's specific profile page from initial search results
*/
const findProfessorPage = (professorName) => {

  //Our url for making initial request to find professor's profile page
  let url = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=Carleton+College&queryoption=HEADER&query=PROFESSORNAME&facetSearch=true";
  url = url.replace("PROFESSORNAME", professorName);

  let tempDiv = document.createElement('div');

  let requestInfo = {
    method: 'GET',
    url: url,
  };

  chrome.runtime.sendMessage(requestInfo, function(data) {

    tempDiv.innerHTML = data;
    let foundProfessors = tempDiv.getElementsByClassName('listing PROFESSOR');
    // console.log(foundProfessors);

    if (foundProfessors.length === 0) {
      //No search results, populate result UI with "N/A"
    } else {
      // //Iterate through search results and verify by comparing first name and last name
      // for (let i = 0; i < foundProfessors.length; i++) {
      //   let currentProfessor = foundProfessors[i];

      //   let foundName = currentProfessor.getElementsByClassName('main')[0].innerText; // returns "Freeze, Kent "
      //   foundName = foundName.replace(/,|\n/g , "").trim().split(" ").reverse();
      //   professorNameArray = professorName.split(" ");
      //   //if name isn't matching, break and return;
      //   if (foundName[0] !== professorNameArray[0] || foundName[1] !== professorNameArray[1]) {
      //     break;
      //   }
      // }

      //There is a search result, fetch professor's profile page link
        let link = foundProfessors[0].getElementsByTagName("a")[0].getAttribute("href"); ///ShowRatings.jsp?tid=2108435
        let profilePageLink = "http://www.ratemyprofessors.com" + link;
        console.log(profilePageLink);

        //make second request
        chrome.runtime.sendMessage({
          method: 'GET',
          url: profilePageLink
        }, function(response) {
          // addRatingsToPage(response);
          console.log('ratings successfully received');
        });
    }

  });

};

const main = () => {

  //check which site we're on, and call handleEnrollPage or handleHubPage
  if (window.location.hostname === "apps.carleton.edu") {
    getNamesFromEnroll();
  } else if (window.location.hostname === "thehub.carleton.edu") {
    getNamesFromHub();
  }
};


const addRatingsToPage = () => {


};

main();