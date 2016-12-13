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


const processFirstRequest = (data, name) => {

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


const processSecondRequest = (data, map, name) => {

  let gradeInfo = {
    overallQuality : "N/A",
    wouldTakeAgain : "N/A",
    levelOfDifficulty : "N/A"
  }

  data = data.replace('/assets/chilis/warm-chili.png', '');
  data = data.replace('/assets/chilis/cold-chili.png', '');
  data = data.replace('/assets/chilis/new-hot-chili.png', '');
  data = data.replace('/assets/mobileAppPromo.png', '');
  data = data.replace('assets/ok.png');

  let ratingResults = document.createElement("div");
  ratingResults.innerHTML = data;

  let ratings = ratingResults.getElementsByClassName("grade");
  //May not exist yet(Reviews have not been added)
  //OR [0] : overall quality  [1] : would take again  [2] : level of difficulty

  if (ratings.length >= 3) {
    gradeInfo.overallQuality = ratings[0].innerText.replace(/\n/g, "").trim();
    gradeInfo.wouldTakeAgain = ratings[1].innerText.replace(/\n/g, "").trim();
    gradeInfo.levelOfDifficulty = ratings[2].innerText.replace(/\n/g, "").trim();
  }
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

    let profNames = facultyNode.innerText.split(", ");

    //iterate over professor names, because one class can have multiple instructors
    for (let i = 0; i < profNames.length; i++) {
      let finalizedProfName = formatProfNameWithSpace(profNames[i]);

      if (professorMap.has(finalizedProfName)) {

        addRatings(professorMap.get(finalizedProfName), facultyNode);

      } else {

        findProfessorPage(finalizedProfName)
          .then((data) => { return processFirstRequest(data, finalizedProfName) })
            .then(fetchRatings)
              .then((data) => { return processSecondRequest(data, professorMap, finalizedProfName) })
                .then((professorInfo) => { addRatings(professorInfo, facultyNode); })
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

  profNamesFromHub.forEach(function(facultyNode) {

    //remove all commas from names and split into array
    let profNames = facultyNode.innerText.replace(/,|\n/g , "").split(" ");

    for (let i = 0; i < profNames.length; i+=2) {
      let formattedProfName = profNames[i+1] + "+" + profNames[i];

      //This professor's not in our map yet, go ahead and make request
      if (professorMap.has(formattedProfName)) {
        //call add ratings function
        console.log(professorMap.get(finalizedProfName));
      } else {

        findProfessorPage(formattedProfName)
          .then(processFirstRequest)
            .then(fetchRatings)
              .then((data) => { processSecondRequest(data, professorMap, formattedProfName); })
                .then((data) => { addRatings(data, facultyNode); })
                  .catch( (reason) => { console.error("Caught error for this :", reason); });
      }

    }
  });
};


/*
  Finds professor's specific profile page from initial search results
*/
const findProfessorPage = (professorName) => {

  //Our url for making initial request to find professor's profile page
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
  console.log(profilePageLink);

  return new Promise(function(resolve, reject) {
    //make second request
      chrome.runtime.sendMessage({
        method: 'GET',
        url: profilePageLink
      }, function(data) {

        if (data) {
          resolve(data);
        } else {
          reject(data);
        }
      });
  });
};


const addRatings = (professorData, facultyNode) => {

  console.log('facultyNode :', facultyNode);
  console.log('profesorData : ' , professorData);

  let heading = document.createElement("h4");
  let overallRating = document.createElement("p");
  let wouldTakeAgainPercentage = document.createElement("p");
  let difficultyRating = document.createElement("p");

  overallRating.innerText = "Average Rating : " + professorData.overallQuality;
  wouldTakeAgainPercentage.innerText = "Would Take Again : " + professorData.wouldTakeAgain;
  difficultyRating.innerText = "Difficulty : " + professorData.levelOfDifficulty;

  // console.log('overallRating :', overallRating);
  // console.log('wouldTakeAgainPercentage :', wouldTakeAgainPercentage);
  // console.log('difficultyRating :', difficultyRating);
  //check if enroll or hub
  //enroll
  facultyNode.appendChild(overallRating);
  facultyNode.appendChild(wouldTakeAgainPercentage);
  facultyNode.appendChild(difficultyRating);
};


const main = () => {

  let processedProfessorSoFar = new Map();

  //check which site we're on, and call handleEnrollPage or handleHubPage
  if (window.location.hostname === "apps.carleton.edu" && window.location.pathname === "/campus/registrar/schedule/enroll/") {
    getNamesFromEnroll(processedProfessorSoFar);
  } else if (window.location.hostname === "thehub.carleton.edu") {
    getNamesFromHub(processedProfessorSoFar);
  }
};

main();