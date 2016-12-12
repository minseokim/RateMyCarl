/**
  RateMyCarl - Project by Alex Kim '17
  Made with <3 for Carleton Students
**/

const formatProfNameWithSpace = (name) => {

  if (Array.isArray(name)) {
    name = name.join("");
  }

  let nameArr = name.split(' ');
  let formattedProfName = [];
  formattedProfName.push(nameArr[0]);
  formattedProfName.push(nameArr[nameArr.length-1]);
  formattedProfName = formattedProfName.join(' ');

  return formattedProfName;
};

//handles parsing professor names from enroll page
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

  return profNameSet;
};

// //handles parsing professor names from the hub
// const getNamesFromHub = function() {

//   let profNameSet = new Set();

//   let profNamesFromHub = document.getElementsByClassName(" SEC_FACULTY_INFO");

//   //change returned HTMLCollection to array
//   profNamesFromHub = Array.from(profNamesFromHub);

//   //Hougen-Eitzman, David, Mitra, Raka
//   //Keiser, Richard

//   profNamesFromHub.forEach(function(facultyNode) {
//     let profName = facultyNode.innerText;
//     console.log(profName);
//     profName = profName.split(", ");
//     // console.log(profName);
//   });
// };


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

getNamesFromEnroll();
// getNamesFromHub();