/**
  RateMyCarl - Project by Alex Kim '17
  Made with <3 for Carleton Students
**/

const formatProfNameWithSpace = (nameArray) => {
  let formattedProfName = [];
  formattedProfName.push(nameArray[0]);
  formattedProfName.push(nameArray[profName.length-1]);
  let profName = formattedProfName.join(' ');
  return profName;
};

//handles parsing professor names from enroll page
const getNamesFromEnroll = function() {

  let profNameSet = new Set();

  let profNamesFromEnroll = document.getElementsByClassName("faculty");

  //change returned HTMLCollection to array
  profNamesFromEnroll = Array.from(profNamesFromEnroll);

  //add all profNames from enroll page to set to handle duplicates
  profNamesFromEnroll.forEach(function(facultyNode) {

    let profName = facultyNode.innerText.split(", ");

    if (profName.length === 1) {

      profNameSet.add(profName.join(""));

    } else if (profName.length === 3) {
      //Edge Case 1 : Professor has middle name("Richard A Keiser")
      profNameSet.add(formatProfNameWithSpace(profName));
    } else {
      //Edge Case 2 : Class has multiple instructors("Mark McKone, Stephan G Zweifel")
    }

    //Handle two edge cases : classes multiple profs, and profs with middle name

    if (profName.)
    if (profName.length > 2) {
      //"Mark McKone, Stephan G Zweifel"
      if (profName.length > 3) {
        profName = profName.split(', ');

      } else {
        //"Richard A Keiser"
        profName = formatProfNameWithSpace(profName.split(' '));
      }
    } else {
      profNameSet.add()
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
getNamesFromHub();