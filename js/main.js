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
const getNamesFromEnroll = (professorMap) => {

  let profNamesFromEnroll = document.getElementsByClassName("faculty");

  //change returned HTMLCollection to array
  profNamesFromEnroll = Array.from(profNamesFromEnroll);

  profNamesFromEnroll.forEach(function(facultyNode) {

    let profNames = facultyNode.innerText.split(", ");

    //iterate over professor names, because one class can have multiple instructors
    for (let i = 0; i < profNames.length; i++) {
      let finalizedProfName = formatProfNameWithSpace(profNames[i]);

      if (!professorMap.has(finalizedProfName)) {
        //rmpInfo means data we get back from RateMyProfessor.com
        let rmpInfo = findProfessorPage(finalizedProfName);

        //map each professor name to the data
        professorMap.set(finalizedProfName, rmpInfo);
      }

      //call add ratings function
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

  profNamesFromHub.forEach(function(facultyNode) {

    //remove all commas from names and split into array
    let profNames = facultyNode.innerText.replace(/,|\n/g , "").split(" ");

    for (let i = 0; i < profNames.length; i+=2) {
      let formattedProfName = profNames[i+1] + "+" + profNames[i];

      if (!professorMap.has(formattedProfName)) {
        //rmpInfo means data we get back from RateMyProfessor.com
        let rmpInfo = findProfessorPage(formattedProfName);

        //map each professor name to the data
        professorMap.set(finalizedProfName, rmpInfo);
      }

      //call add ratings function
    }
  });

  return profNameSet;
};


/*
  Finds professor's specific profile page from initial search results
*/
const findProfessorPage = () => {

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
      return;
    } else {
      //There is a search result, fetch professor's profile page link
        let link = foundProfessors[0].getElementsByTagName("a")[0].getAttribute("href"); ///ShowRatings.jsp?tid=2108435
        let profilePageLink = "http://www.ratemyprofessors.com" + link;

        //make second request
        chrome.runtime.sendMessage({
          method: 'GET',
          url: profilePageLink
        }, function(response) {
          // addRatingsToPage(response);

          response = response.replace('/assets/chilis/warm-chili.png', '');
          response = response.replace('/assets/chilis/cold-chili.png', '');
          response = response.replace('/assets/chilis/new-hot-chili.png', '');
          response = response.replace('/assets/mobileAppPromo.png', '');
          response = response.replace('assets/ok.png');
          // console.log('ratings successfully received');

          let ratingResults = document.createElement("div");
          ratingResults.innerHTML = response;

          let ratings = ratingResults.getElementsByClassName("grade");
          //May not exist yet(Reviews have not been added)
          //OR [0] : overall quality  [1] : would take again  [2] : level of difficulty

          let overallQuality = "N/A";
          let wouldTakeAgain = "N/A";
          let levelOfDifficulty = "N/A";

          if (ratings.length >= 3) {
            overallQuality = ratings[0].innerText;
            wouldTakeAgain = ratings[1].innerText;
            levelOfDifficulty = ratings[2].innerText;
          }

          let gradeInfo = {
            overallQuality : overallQuality,
            wouldTakeAgain : wouldTakeAgain,
            levelOfDifficulty : levelOfDifficulty
          }

        });
      }
  });

  return gradeInfo;
};



const addRatingsToPage = (professorInfo) => {

};


const main = () => {

  let processedProfessorSoFar = new Map();

  //check which site we're on, and call handleEnrollPage or handleHubPage
  if (window.location.hostname === "apps.carleton.edu") {
    getNamesFromEnroll(processedProfessorSoFar);
  } else if (window.location.hostname === "thehub.carleton.edu") {
    getNamesFromHub(processedProfessorSoFar);
  }
};

main();