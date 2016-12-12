/**
  RateMyCarl - Project by Alex Kim '17
  Made with <3 for Carleton Students
**/

/*
  Formats professors with middle names i.e. "Richard A Keiser" => "Richard Keiser"
*/
const formatProfNameWithSpace = (name) => {

  let nameArr = name.split(" ");
  let formattedProfName = nameArr[0] + " " + nameArr[nameArr.length-1];

  return formattedProfName;
};

/*
  Fetches all professor names from enroll page and stores in a set
*/
const getNamesFromEnroll = function() {

  let profNameSet = new Set();

  let profNamesFromEnroll = document.getElementsByClassName("faculty");

  //change returned HTMLCollection to array
  profNamesFromEnroll = Array.from(profNamesFromEnroll);

  //add all profNames from enroll page to set to handle duplicates
  profNamesFromEnroll.forEach(function(facultyNode) {

    let profNames = facultyNode.innerText.split(", ");

    for (let i = 0; i < profNames.length; i++) {
      profNameSet.add(formatProfNameWithSpace(profNames[i]));
    }

  });

  // profNameSet.forEach((name) => {
  //   console.log(name);
  // });

  return profNameSet;
};

/*
  Fetches all professor names from The Hub and stores them in a set
*/
const getNamesFromHub = function() {

  let profNameSet = new Set();

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
      let formattedProfName = profNames[i+1] + " " + profNames[i];
      console.log(formattedProfName);
      profNameSet.add(formattedProfName);
    }
  });

  return profNameSet;

};


const addRatings = function() {
// http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=Carleton+College&queryoption=HEADER&query=Kent+Freeze&facetSearch=true

  // console.log(window.location);
  // hostname : apps.carleton.edu
  // pathname : /campus/registrar/schedule/enroll/

  //check which site we're on, and call handleEnrollPage or handleHubPage
};


//fetches ratings from RateMyProfessor.com
const fetchRatings = function() {

};