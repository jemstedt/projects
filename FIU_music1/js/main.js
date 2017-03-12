//ATT GÖRA:
//
//ta bort alla console.log som skulle kunna förstöra expet
//Fundera på om du ska ta bort att de inte kan markera texten (css-filen), det verkar inte fungera i firefox men i de andra
//Testkör en massa
//
//Ändra alla tider
//

// =============================================================== GLOBAL VARIABLES ========================================================

// <<<<<<<<<<<<<<<<<<<<<<<<<< Input & Output >>>>>>>>>>>>>>>>>>>>
var stim;
var df = [];
var items = [];
var lures = [];
var pracItems = [];
var noteReadingItems = [];
var dateAndTime = new Date();
var participant;
var list; //EMPTY ON FINAL VERSION
var judgmentType = ""; //EMPTY ON FINAL VERSION?
var firstTime; //EMPTY ON FINAL VERSION //first time participating in the experiment
var pNrArray = [];
var outputFileName = "";
var stimFileName = "data/FIU_musicStim.tsv";


// <<<<<<<<<<<<<<<<<<<<<<<<<< Participant Input >>>>>>>>>>>>>>>>>>>>
var consent;
var consentDate;
var sex;
var age;
var psych_student; //EMPTY ON FINAL VERSION?
var EEString = "";
var consentString = "";

var q_pianoTime = "x";
var q_pianoLessonTime = "x";
var q_currentlyPlaying = "x";
var q_timeSinceStoppedPlaying = "x";
var q_playingProficiency = "x";
var q_sightReadingProficiency = "x";
var q_byEarProficiency = "x";
var q_musicTheory = "x";
var q_musicTheoryText = "x";
var q_otherInstrument = "x";
var q_otherInstrumentText = "x";


// <<<<<<<<<<<<<<<<<<<<<<<<<< AFTER EXP Input >>>>>>>>>>>>>>>>>>>>

var q_belief = "x";
var q_firstEnglish = "x";
var q_languageText = "x";
var q_disturbed = "x";
var q_disturbedText = "x";
var q_ratingEffort = "x";
var q_studyEffort = "x";
var q_computerText = "x";


// <<<<<<<<<<<<<<<<<<<<<<<<<< General >>>>>>>>>>>>>>>>>>>>
var blockNr = 0;
var blockArr = ['Beginning','consent','checkPnumber','expEND','endInfo'];
//var blockArr = ['Beginning','consent','noteReadingInfo','noteReading','studyRatingInfo','studyRating','testInfo','test','afterExpQuestions','expEND','endInfo'];
//var blockArr = ['Beginning','backgroundInput','noteReading','studyRatingInfo','studyRating','testInfo','test','expEND','endInfo'];
//var blockArr = ['Beginning','consent','backgroundInput','startInfo','EOLRatingInfo','rating','studyInfo','study','distInfo1','distraction1','testInfo','freeRecall','afterExpQuestions','expEND','endInfo'];


var totalTimeStart;
var totalTimeStop;
var totalExpTime;
var timeStart = 0;
var timeStop = 0;

var interStimTime = 1000; // 500?
var studyTime = 5000; //5000
var distTime = 30*1000; //30 seconds
var ratingTrialTime = 5000;
var noteReadingTrialTime = 10000;
var freeRecallTotalTime = 180 * 1000; //3 minutes

//<<<<<<<<<<<<<<<<<<<<<<<<<< INFO-TIME >>>>>>>>>>>>>>>>>>>>
// - How long the participants takes to read the info
var consentTime = 0;
var startInfoTime = 0;
var studyRatingInfoTime = 0; 
var studyInfoTime = 0;
var testInfoTime = 0; 
var distInfoTime1 = 0; 
var backgroundInputTime = 0;
var noteReadingInfoTime = 0;

// <<<<<<<<<<<<<<<<<<<<<<<<<< Distraction >>>>>>>>>>>>>>>>>>>>
var distDf = [{dIndexVar : "firstEmptyRowForSecurity",  distItem : "firstEmptyRowForSecurity", block : "firstEmptyRowForSecurity", participant : participant, eq : "firstEmptyRowForSecurity", correct : "firstEmptyRowForSecurity", resp : 'x', time : 'x', totalTime : 'x'}];
var distInputArr;
var distArr;
var distOutputRow = 0;

var distB; //The number of the current distraction block

var dIndex;
var distTotalStart;
var distTotalStop;
var distTotalTime;

// <<<<<<<<<<<<<<<<<<<<<<<<<< Study >>>>>>>>>>>>>>>>>>>>
var studyRatingItemArr = [];
var studyTimeArr = [];

// <<<<<<<<<<<<<<<<<<<<<<<<<< Rating >>>>>>>>>>>>>>>>>>>>
var ratingArr = [];
var ratingTimeArr = [];

// <<<<<<<<<<<<<<<<<<<<<<<<<< Note reading test >>>>>>>>>>>>>>>>>>>>
var noteReadingItemArr = [];
var noteReadingTimeArr = [];
var noteReadingRespArr = [];

// <<<<<<<<<<<<<<<<<<<<<<<<<< Test >>>>>>>>>>>>>>>>>>>>
var written = "";
var testRespArr = [];
var testTimeArr = [];
var testItemArr = [];
var cueArr = [];
var targetArr = [];



// =============================================================== INPUT & OUTPUT DATA ========================================================
// Returns a csv from an array of objects with
// values separated by tabs and rows separated by newlines
function convertToTSV(array) {
    // Use first element to choose the keys and the order
    var keys = Object.keys(array[0]);

    // Build header
    var result = keys.join("\t") + "\n";

    // Add the rows
    array.forEach(function(obj){
        keys.forEach(function(k, ix){
            if (ix) result += "\t";
            result += obj[k];
        });
        result += "\n";
    });

    return result;
}


function createOutputDF(){
  //Create the empty data frame
  for(var i=0; i<stim.length; i++)
  {
    df.push({index : "x", date : dateAndTime.toDateString(), time : dateAndTime.toTimeString(), participant : participant, sex : 'x', age : 'x', 
        itemType : "x", itemNr : "x", item : "x", itemDiff : "x",
        oldOrNew : "x", testItem : 'x', testResp : 'x', correct : 0, testTrial : 'x',testTime : "x", judgmentType : "x", ratingItem : 'x', 
        studyRatingTrial : "x", studyRatingItem : "x", studyTime : 'x', rating : "x", ratingTime : "x",
        noteReadingItem : "x", noteReadingTrial : "x", noteReadingItemText : "x", noteReadingRespArr : "x", noteReadingRespTime : "x", noteReadingCorrect : "x",
        totalExpTime : "x", startInfoTime : 'x', backgroundInputTime : 'x', studyRatingInfoTime : 'x',
        studyInfoTime : 'x',testInfoTime : 'x',distInfoTime1 : 'x', noteReadingInfoTime : "x",
        psych_student : 'x', firstTime : 'x', consent : consent, consentTime : 'x', previouslyUsedPnumber : "x",
        q_pianoTime : "x", q_pianoLessonTime : "x", q_currentlyPlaying : "x", q_timeSinceStoppedPlaying : "x", q_playingProficiency : "x",
        q_sightReadingProficiency : "x", q_byEarProficiency : "x", q_musicTheory : "x", q_musicTheoryText : "x", q_otherInstrument : "x",
        q_otherInstrumentText : "x", q_belief : "x", q_firstEnglish : "x", q_languageText : "x", q_disturbed : "x", q_disturbedText : "x",
        q_ratingEffort : "x", q_studyEffort : "x", q_computerText : "x",
        screen_width : screen.width, screen_height : screen.height, screen_availWidth : screen.availWidth, screen_availHeight : screen.availHeight}
      );
  }
addConditionsToDF();
}

function addConditionsToDF(){
  var oldOrNewArr = [];
  var pracOldOrNewArr = [];
  var numberOfItems = 0;
  var numberOfPracs = 0;

  //Set index and info from stim file
  for(var i=0; i<df.length; i++){
    df[i].index = i;
    df[i].itemType = stim[i].ItemType;
    df[i].item = stim[i].Item;
    df[i].itemDiff = stim[i].ItemDiff;
    df[i].itemNr = stim[i].ItemNr;
    df[i].noteReadingItemText = stim[i].NoteReadingItemText;

    if (df[i].itemType == "main"){
      $('#studyRatingStimContainer').append($('<img>',{class: "imageStim", id: df[i].item +'studyRating' ,src:"data/pictures/" + df[i].item + ".png"}));
      $('#testStimContainer').append($('<img>',{class: "imageStim", id: df[i].item + 'test' ,src:"data/pictures/" + df[i].item + ".png"}));
    }
    else if (df[i].itemType == "noteReading"){
      $('#noteReadingStimContainer').append($('<img>',{class: "imageStim", id: df[i].item + 'noteReading' ,src:"data/pictures/" + df[i].item + ".png"}));
    };
    console.log(df[i].item);
  };

  //count items and practice items
  for(var i=0; i<(df.length); i++){
    if (df[i].itemType == "main"){
      numberOfItems++
    }
    else if (df[i].itemType== "prac"){
      numberOfPracs++; 
    };
  }

  // lure or not for items
  for(var i=0; i<(numberOfItems/2); i++){
    oldOrNewArr.push("old");
    oldOrNewArr.push("new");
  }
  oldOrNewArr = _.shuffle(oldOrNewArr); 
  // lure or not for practice items (allways stim)
  for(var i=0; i<(numberOfPracs); i++){
    pracOldOrNewArr.push("old");
  }
  pracOldOrNewArr = _.shuffle(pracOldOrNewArr);
  
  // to keep track on how many items have been assigned so that the lure or not is taken from the correct array
  var pracAssigned = 0;
  var itemAssigned = 0;

  //Set the lure or not for every item
  for(var i=0; i<df.length; i++){
    if (df[i].itemType == "main"){
      df[i].oldOrNew = oldOrNewArr[itemAssigned]; 
      itemAssigned++;
    }
    else if (df[i].itemType == "prac"){
      df[i].oldOrNew = pracOldOrNewArr[pracAssigned];
      pracAssigned++;
    };
  };

  //put items in arrays for easy access
  for(var i=0; i<df.length; i++){
    if (df[i].itemType == "main"){
      if (df[i].oldOrNew == "old"){
        items.push(df[i].item);
      }
      else if (df[i].oldOrNew == "new"){
        lures.push(df[i].item);
      };
    }
    else if (df[i].itemType == "prac") {
      pracItems.push(df[i].item);
    }
    else if (df[i].itemType == "noteReading"){
      noteReadingItems.push(df[i].item);
    };
    
  }
} 

//Fill output file with test data
function testData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){
    for(var tItem=0; tItem<df.length; tItem++){
      if (df[dfItem].item == testItemArr[tItem]){
        df[dfItem].testTrial = tItem;
        df[dfItem].testItem = testItemArr[tItem];
        df[dfItem].testTime = testTimeArr[tItem];
        df[dfItem].testResp = testRespArr[tItem];
        if (df[dfItem].oldOrNew == testRespArr[tItem]){
          df[dfItem].correct = 1;
        } else {
          df[dfItem].correct = 0;
        };  
      }
    }
  }
}

//Fill output file with study and rating data
function studyRatingData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){
    for(var srItem=0; srItem<df.length; srItem++){
      if (df[dfItem].item == studyRatingItemArr[srItem]){
        df[dfItem].studyRatingTrial = srItem;
        df[dfItem].studyRatingItem = studyRatingItemArr[srItem];
        df[dfItem].studyTime = studyTimeArr[srItem];

        df[dfItem].ratingTime = ratingTimeArr[srItem];
        df[dfItem].rating = ratingArr[srItem];
      }
    }
  }
}

function noteReadingData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){
    for(var nrItem=0; nrItem<df.length; nrItem++){
      if (df[dfItem].item == noteReadingItemArr[nrItem]){
        df[dfItem].noteReadingTrial = nrItem;
        df[dfItem].noteReadingItem = noteReadingItemArr[nrItem];
        df[dfItem].noteReadingRespTime = noteReadingTimeArr[nrItem];

        df[dfItem].noteReadingRespArr = noteReadingRespArr[nrItem];
        if (df[dfItem].noteReadingItemText == noteReadingRespArr[nrItem]){
          df[dfItem].noteReadingCorrect = 1;
        } else {
          df[dfItem].noteReadingCorrect = 0;
        };
      }
    }
  }
}

//Fill output file with data that the same value goes on every row (e.g., participant number)
function addSameOnEachRowData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){

    //Info from consentform and background
    df[dfItem].sex = sex;
    df[dfItem].age = age;
    df[dfItem].judgmentType = judgmentType;
    df[dfItem].participant = participant;
    df[dfItem].psych_student= psych_student;
    df[dfItem].firstTime = firstTime;
    df[dfItem].consent = consent;
    df[dfItem].consentTime = consentTime;
    df[dfItem].previouslyUsedPnumber = previouslyUsedPnumber;
    //Time for all info screens and questions
    df[dfItem].startInfoTime = startInfoTime;
    df[dfItem].studyRatingInfoTime = studyRatingInfoTime;
    df[dfItem].studyInfoTime = studyInfoTime;
    df[dfItem].testInfoTime = testInfoTime;
    df[dfItem].distInfoTime1 = distInfoTime1;
    df[dfItem].backgroundInputTime = backgroundInputTime;
    df[dfItem].totalExpTime = totalExpTime;
    df[dfItem].noteReadingInfoTime = noteReadingInfoTime;
    //Before exp questions
    df[dfItem].q_pianoTime = q_pianoTime;
    df[dfItem].q_pianoLessonTime = q_pianoLessonTime;
    df[dfItem].q_currentlyPlaying = q_currentlyPlaying;
    df[dfItem].q_timeSinceStoppedPlaying = q_timeSinceStoppedPlaying;
    df[dfItem].q_playingProficiency = q_playingProficiency;
    df[dfItem].q_sightReadingProficiency = q_sightReadingProficiency;
    df[dfItem].q_byEarProficiency = q_byEarProficiency;
    df[dfItem].q_musicTheory = q_musicTheory;
    df[dfItem].q_musicTheoryText = q_musicTheoryText;
    df[dfItem].q_otherInstrument = q_otherInstrument;
    df[dfItem].q_otherInstrumentText = q_otherInstrumentText; 
    //After exp questions
    df[dfItem].q_belief = q_belief;
    df[dfItem].q_firstEnglish = q_firstEnglish;
    df[dfItem].q_languageText= q_languageText;
    df[dfItem].q_disturbed = q_disturbed;
    df[dfItem].q_disturbedText = q_disturbedText;
    df[dfItem].q_ratingEffort = q_ratingEffort;
    df[dfItem].q_studyEffort = q_studyEffort;
    df[dfItem].q_computerText = q_computerText;
  }
}


// Check if the pnumber has been used before, if it has, write that in the outputfile
var pNumber;
var previouslyUsedPnumber = "no";
var pCheck;

//Check the pnumber by using php
function checkPnumber(){
  console.log("inside checkPnumber()");
  $.post("checkPnumber.php",{number: pNumber},function(response,status){
    previouslyUsedPnumber = response;
    console.log("response: " + response);
    console.log("status: " + status);
    expBlock();
  });
};

function pNrLoad(){
  //Select numberfile based on sex
  var filename ="";
  filename = "data/participantNr.tsv";
  
  console.log(filename);
  //Load the selected file
  d3.tsv(filename, function(data){
    pNrArray = data;

    //Do stuff with the file content
    var emergencyNr = 0;
    //Go through the array until unused number is found
    for (var i=0; i<pNrArray.length; i++){
      emergencyNr = i;
      if (pNrArray[i].used == "no"){
        pNrArray[i].used = "yes";
        participant = pNrArray[i].pNr;
        // condition = pNrArray[i].condition;
        break;
      }
    }

    //If all the numbers are used, then create a new number and randomly assign a condition.
    if (participant == undefined) {
      participant = 1000 + emergencyNr;
      // condition = Math.round(Math.random()*6) + 1;
    }

  //Over write the participant number files with an updated version
  
  if (firstTime == "yes" && psych_student == "yes"){
      postDataToServer(convertToTSV(pNrArray), "participantNr.tsv");
  //Load stimuli from server
  }
  loadStim();
  loadDist(); 
  });
}

//Loading stimuli from a file
function loadStim(){
  d3.tsv(stimFileName, function(data){
    stim = data;
    
    //Fill the df array a number of outputRow objects equal to the number of stimuli
    createOutputDF();
  })
}


//Loading distraction items from a file
function loadDist(){
  d3.tsv("data/Distractions.tsv", function(data){
    distInputArr = data;
  })
}

  //Posting stimuli to server
function postDataToServer(myData, myFilename, append = "no"){
  console.log('posting: ' + myFilename);
  console.log('appending?: ' +append);
    $.ajax({
      type: "POST",
      url: 'postData.php',
      data: {data: myData, filename: myFilename, addToFile : append},
    });
}


// =============================================================== TEST ========================================================
function recognitionTestFunc(){
  $('.allDiv').hide();
  $('#outerTest').show();

  testRespArr = [];
  timeStart = new Date().getTime();

  var testItemNr = 0;

  // Add items and lures into one array, then shuffle their order and add them to the testItemArr
  testItemArr = _.shuffle(items.concat(lures));

  console.log("testItemArr: " + testItemArr);

  timeStart = new Date().getTime();

  //First item
  $('.imageStim').hide();

  console.log("testItemArr[testItemNr]: " + testItemArr[testItemNr]);
  $('#' + testItemArr[testItemNr] + 'test').show();

  // <<<<<<<<<<<<<<<<<<<<<<<<<< Go through rating items >>>>>>>>>>>>>>>>>>>>
  function nextTestItem(){
    timeStop = new Date().getTime();
    $('#middleTest').hide();
    $('.imageStim').hide();
    testItemNr++;
    testTimeArr.push(timeStop - timeStart);
    
    setTimeout(function(){
      $('#middleTest').show();
      if (testItemArr.length > testItemNr){
        console.log("testItemArr[testItemNr]: " + testItemArr[testItemNr]);
        $('#'+ testItemArr[testItemNr] + 'test').show();
      };
      timeStart = new Date().getTime();
      if (testItemArr.length == testItemNr) {
        testData();
        expBlock();
        $('.testButton').unbind();
      }
    }, interStimTime);
  };

  //Buttons
  $('.testButton').hover(function(){$(this).toggleClass('button_hover');});
  $('#testOldButton').click(function(){testRespArr.push("old"); nextTestItem()})
  $('#testNewButton').click(function(){testRespArr.push("new"); nextTestItem()})
};

// =============================================================== STUDY and Immediate JOL========================================================
function studyRatingFunc(){
  $('.allDiv').hide();
  $('#outerStudyRating').show();
  $('#ratingButtonContainer').css('visibility', 'hidden');
  $('#ratingQuestion').css('visibility', 'hidden');
  $('#ratingTime').css('visibility', 'hidden');
  
  studyRatingItemArr = _.shuffle(items);
  console.log("studyRatingItemArr: " + studyRatingItemArr);


  var studyRatingItemNr = 0; //Start on first item

  var ratingTimeout;
  var ratingTimerClock;

  timeStart = new Date().getTime();
  
  //Set first study item
  console.log("studyRatingItemNr: " + studyRatingItemNr);

  $('.imageStim').hide();
  $('#'+ studyRatingItemArr[studyRatingItemNr] + 'studyRating').show();

  //Set a timeout so that the first item has time to load, the following items can load during the interstimulus intervals
  var firstTimeout = setTimeout(studyTimeLoop(),interStimTime);

// <<<<<<<<<<<<<<<<<<<<<<<<<< Loop through study items >>>>>>>>>>>>>>>>>>>>

  function studyTimeLoop () {
    $('.imageStim').hide();
    $('#'+ studyRatingItemArr[studyRatingItemNr] + 'studyRating').show();
    timeStart = new Date().getTime();

    setTimeout(function () {
      //$('#middleStudyRating').hide();
      timeStop = new Date().getTime();
      studyTimeArr.push(timeStop - timeStart);
      //Start the rating part of the phase with the same item
      nextRating();
      }, studyTime);
    };

  // <<<<<<<<<<<   function starting what to do when the time is up >>>>>>>
  function ratingIsDone (timeout = false){
    //Clear the timers
    clearInterval(ratingTimerClock);
    clearTimeout(ratingTimeout);
    // Hide the stim image
    $('.imageStim').hide();
    
    // Rating time
    timeStop = new Date().getTime(); 

    // Hide rating elements
    $('#ratingButtonContainer').css('visibility', 'hidden');
    $('#ratingQuestion').css('visibility', 'hidden');
    $('#ratingTime').css('visibility', 'hidden');

    // Save rating time
    ratingTimeArr.push(timeStop - timeStart);
    console.log("timeout = " + timeout);

    if (timeout == true){
      ratingArr.push("timeout");
    };
    studyRatingItemNr++;
    console.log("ratingIsDone studyRatingNr:" + studyRatingItemNr);

    // When last item has been presented, load everything into the output DF, else go on with the studyRating phase
    if (studyRatingItemArr.length == studyRatingItemNr) {
      studyRatingData();
      expBlock();
      $('.ratingButton').unbind();
    } else {
      setTimeout(function(){
        studyTimeLoop();
      }, interStimTime);
      };
    };

  // <<<<<<<<<<<<<<<<<<<<<<<<<< Go through rating items >>>>>>>>>>>>>>>>>>>>
  function nextRating(){

    console.log("Inside nextRating")
    //Show rating elements
    $('#ratingButtonContainer').css('visibility', 'visible');
    $('#ratingQuestion').css('visibility', 'visible');
    $('#ratingTime').css('visibility', 'visible');

    //Updates the time on the screen every 500 ms
    timeStart = new Date().getTime();
    ratingTimerClock = setInterval(function() {
    $('#ratingTime').text(Math.ceil((ratingTrialTime - (new Date().getTime() - timeStart)) / 1000) + " seconds left");
    }, 500);

    //Set a max time for each rating
    ratingTimeout = setTimeout(function() {
     ratingIsDone(timeout = true); 
    }, ratingTrialTime);
    $('#ratingTime').text(ratingTrialTime/1000 + " seconds left");
  }

  //Buttons
  $('.ratingButton').hover(function(){$(this).toggleClass('button_hover');});
  $('#ratingB0').click(function(){ratingArr.push(0); ratingIsDone()})
  $('#ratingB20').click(function(){ratingArr.push(20); ratingIsDone()})
  $('#ratingB40').click(function(){ratingArr.push(40); ratingIsDone()})
  $('#ratingB60').click(function(){ratingArr.push(60); ratingIsDone()})
  $('#ratingB80').click(function(){ratingArr.push(80); ratingIsDone()})
  $('#ratingB100').click(function(){ratingArr.push(100); ratingIsDone()}) 
};

// =============================================================== Music reading test ========================================================
function noteReadingFunc(){
  $('.allDiv').hide();
  $('#outerNoteReading').show();
  

  noteReadingItemArr = _.shuffle(noteReadingItems);
  console.log("noteReadingItemArr: " + noteReadingItemArr);
  console.log("noteReadingItemArr.length: " + noteReadingItemArr.length);

  var noteReadingItemNr = 0; //Start on first item
  var currentResp = "";
  var noteItemLength = 0;

  var noteReadingTimeout;
  var noteReadingClock;

  timeStart = new Date().getTime();
  
  //Set first study item
  console.log("noteReadingItemNr: " + noteReadingItemNr);

  $('.imageStim').hide();
  $('#'+ noteReadingItemArr[noteReadingItemNr] + 'noteReading').show();

  //Set a timeout so that the first item has time to load, the following items can load during the interstimulus intervals
  var firstTimeout = setTimeout(noteReadingLoop(),interStimTime);

  function noteRespDone (timeout = false){
    // Clear the timers
    clearInterval(noteReadingClock);
    clearTimeout(noteReadingTimeout);
    // Hide the stim image
    $('.imageStim').hide();
    
    // noteReadingTime
    timeStop = new Date().getTime(); 

    // Save rating time
    noteReadingTimeArr.push(timeStop - timeStart);
    console.log("timeout = " + timeout);

    noteReadingItemNr++;
    console.log("noteRespDone noteReadingNr:" +  noteReadingItemNr);

    // When last item has been presented, load everything into the output DF, else go on with the studyRating phase
    if (noteReadingItemArr.length <= noteReadingItemNr) {
      console.log("Last noteReadingItemArr.length: " + noteReadingItemArr.length);
      console.log("Last noteReadingItemNr: " + noteReadingItemNr);
      noteReadingData();
      expBlock();
      $('.noteButton').unbind();
    } else {
      setTimeout(function(){
        noteReadingLoop();
      }, interStimTime);
      };
    };

  // <<<<<<<<<<<<<<<<<<<<<<<<<< Go through noteReadingItems >>>>>>>>>>>>>>>>>>>>
  function noteReadingLoop(){
    console.log("Inside noteReadingLoop")
    currentResp = "";
    $("#noteReadingRespID").text(currentResp);
    //Updates the time on the screen every 500 ms
    timeStart = new Date().getTime();
    noteReadingClock = setInterval(function() {
      $('#noteReadingTime').text(Math.ceil((noteReadingTrialTime - (new Date().getTime() - timeStart)) / 1000) + " seconds left");
    }, 500);

    //Show the current item
    $('#'+ noteReadingItemArr[noteReadingItemNr] + 'noteReading').show();

    //Set a max time for each rating
    noteReadingTimeout = setTimeout(function() {
      //If time is up, add the current response and then proceed to the next item
      noteReadingRespArr.push(currentResp);
      currentResp = ""; 
      noteRespDone(timeout = true);
    }, noteReadingTrialTime);

    $('#noteReadingTime').text(noteReadingTrialTime/1000 + " seconds left");
  };


  function noteButtonFunc(button){
    console.log("Button: " + button);
    noteItemLength = 0;
    // Seach for the current item and get its length
    for(var dfItem=0; dfItem<df.length; dfItem++){
      if (df[dfItem].item == noteReadingItemArr[noteReadingItemNr]){
        console.log("df[dfItem].noteReadingItemText.length: " +df[dfItem].noteReadingItemText.length);
        noteItemLength = df[dfItem].noteReadingItemText.length;
        break;
      }; 
    };

    //Update the current Response
    currentResp += button;
    $("#noteReadingRespID").text(currentResp);

    //Compare the length of the current response with the current items length, if equal or longer proceed to the next item
    if (currentResp.length >= noteItemLength){
      noteReadingRespArr.push(currentResp);
      currentResp = "";
      noteRespDone();
    }
  };

  //Buttons
  $('.noteButton').hover(function(){$(this).toggleClass('button_hover');});
  $('#noteA').click(function(){noteButtonFunc("A");});
  $('#noteB').click(function(){noteButtonFunc("B");});
  $('#noteC').click(function(){noteButtonFunc("C");});
  $('#noteD').click(function(){noteButtonFunc("D");});
  $('#noteE').click(function(){noteButtonFunc("E");});
  $('#noteF').click(function(){noteButtonFunc("F");});
  $('#noteG').click(function(){noteButtonFunc("G");});
};

// =============================================================== DISTRACTION ========================================================
function distFunc(distBlock, dTime){
  console.log('distFunc');
  $('.allDiv').hide();
  $('#outerDist').show();
  $('#middleDist').show();
  distB = distBlock;
  
  if (distOutputRow > 0){
    distOutputRow++;
  }
  dIndex = 0;
  distTotalStart = new Date().getTime();
  distTotalStop;
  distTotalTime = 0;

 setTimeout(function(){
    $('.distButton').unbind();

    $('#middleDist').hide();
    timeStop = new Date().getTime();
    distDf[distOutputRow].time = (timeStop - timeStart);

    distTotalStop = new Date().getTime();
    distTotalTime = (distTotalStop - distTotalStart);
    distDf[distOutputRow].totalTime = distTotalTime;
    expBlock();

  }, dTime); // After dTime has passed, the distraction stops

  distArr = _.shuffle(distInputArr);

  timeStart = new Date().getTime();

  // <<<<<<<<<<<<<<<<<<<<<<<<<< Go through distraction items >>>>>>>>>>>>>>>>>>>>

  function nextDist(){
    console.log('Block: ' + distBlock);
    $('#middleDist').hide();
    timeStop = new Date().getTime();
    distDf[distOutputRow].time = (timeStop - timeStart);
    dIndex++;
    distOutputRow++;

    if (dIndex == distArr.length){ //If all distractions has been used, start from the beginning but randomize the order of the equations
      dIndex = 0;
      distArr = _.shuffle(distInputArr);
    }
    $('#distStim').text(distArr[dIndex].eq);
    distDf[distOutputRow] = {dIndexVar : dIndex,  distItem : distOutputRow, block : distBlock, participant : participant, eq : distArr[dIndex].eq, correct : distArr[dIndex].correct, resp : 'x', time : 'x', totalTime : 'x'};
    setTimeout(function(){
      $('#middleDist').show();
      timeStart = new Date().getTime();
    }, interStimTime);
  }

  distDf[distOutputRow] = {dIndexVar : dIndex,  distItem : distOutputRow, block : distBlock, participant : participant, eq : distArr[dIndex].eq, correct : distArr[dIndex].correct, resp : 'x', time : 'x', totalTime : 'x'};
  $('#distStim').text(distArr[dIndex].eq);
  
    //Distraction buttons
  $('.distButton').hover(function(){$(this).toggleClass('button_hover');});
  $('#distYes').click(function(){
    distDf[distOutputRow].resp = 'yes';
    nextDist()
  })
  $('#distNo').click(function(){
    distDf[distOutputRow].resp = 'no';
    nextDist()})  
}

// =============================================================== PARTICIPANT CONSENT ========================================================
function consentFunc(){
  $('.allDiv').hide();
  $('.consentClass').show();

  timeStart = new Date().getTime();

  $('.consentFormButton').hover(function(){$(this).toggleClass('button_hover');});
  //Button-click
  $('#consentButton').click(function(){
    done = true;
    if ($("input[name=consentRadio]:checked").val() == 'no') {
      done = false;
      alert('You have selected that you have not read the consent form or agree to participate in this study. Press the "Cancel" button to leave this study.');
    }
    else if ($("input[name=consentRadio]:checked").val() == 'yes') {
      if ($("#fname").val() == "") {
        done = false;
        alert('Fill in your first name.');
      }
      else if ($("#lname").val() == "") {
        done = false;
        alert('Fill in your family name.');
      }
      else if ($("#pNr").val() == "") {
        done = false;
        alert('Fill in your panther ID');
      }
      else if ($("#pNr").val().length != 7 || isNaN($("#pNr").val()) == true) {
        alert('Your panther ID needs to be 7 digits'); 
        done = false;
      }
    };
    if (done == true) {
      $('.consentFormButton').unbind();
      timeStop = new Date().getTime();
      consentTime = (timeStop - timeStart);
      consentDate = new Date();
      consent = $("input[name=consentRadio]:checked").val();
      pNumber = $("#pNr").val();
      EEString = consentDate.toDateString() +","+ consent + "," + $("#fname").val() + "," + $("#lname").val() + "," + $("#pNr").val();
      consentString = consentDate.toDateString() +","+ consent + "," + $("#fname").val() + "," + $("#lname").val() + "," + $("#pNr").val();
      //append the persons information to the allConsent.csv
      postDataToServer(consentString, "output/consent/_allConsent.csv","yes");
      expBlock(); 
  };
     
  });
  $('#cancelButton').click(function(){
    $('.consentFormButton').unbind();
    $('.allDiv').hide();
    $('.cancelScreen').show();
  });
}

// =============================================================== AFTER EXP INPUT ========================================================
function afterExpInput(){
  $('.allDiv').hide();
  $('.afterExpClass').show();
  $('.button').hover(function(){$(this).toggleClass('button_hover');});
  var done = true;
  //Button-click
  $('.button').click(function(){
    done = true;
    if ($("input[name=belief]:checked").val()== undefined) {
      done = false;
      alert('You have to select the presentation method that you think made it more likely that you would learn each word.');
    }
    else if ($("input[name=firstEnglish]:checked").val()== undefined) {
      done = false;
      alert('You have to select whether English is your first language.');
    }
    else if ($("input[name=firstEnglish]:checked").val()== "no" && $("#languageText").val() == ""){
      done = false;
      alert('You have to write the name of your first language.');
    }
    else if ($("input[name=disturbed]:checked").val()== undefined) {
      done = false;
      alert('You have to select whether you were disturbed by anything in your surrounding.');
    }
    else if ($("input[name=disturbed]:checked").val()== "yes" && $("#disturbedText").val() == ""){
      done = false;
      alert('You have to write how you were disturbed.');
    }
    else if ($("input[name=ratingEffort]:checked").val()== undefined) {
      done = false;
      alert('You have to select how much effort you put into making accurate judgments.');
    }
    else if ($("input[name=studyEffort]:checked").val()== undefined) {
      done = false;
      alert('You have to select how much effort you put into learning the words');
    }
    else if ($("#computerText").val() == ""){
      done = false;
      alert('You have to write what type of computer you used during the experiment');
    }

    if(done == true){
      q_belief = $("input[name=belief]:checked").val();
      q_firstEnglish = $("input[name=firstEnglish]:checked").val();
      q_languageText = $("#languageText").val();
      q_disturbed = $("input[name=disturbed]:checked").val();
      q_disturbedText = $("#disturbedText").val();
      q_ratingEffort = $("input[name=ratingEffort]:checked").val();
      q_studyEffort = $("input[name=studyEffort]:checked").val();
      q_computerText = $("#computerText").val();
      $('.button').unbind();
      expBlock();
      }
  });
}

// =============================================================== Background INPUT ========================================================
function backgroundInputFunc(){
  var done = true;

  $('.allDiv').hide();
  $('.backgroundClass').show();

  $('#course_credit_form').show();
  timeStart = new Date().getTime();

  //Hovers
  $('.button').hover(function(){$(this).toggleClass('button_hover');});
  //Button-click
  $('.button').click(function(){
    done = true;

    if ($("input[name=firstTime]:checked").val()== undefined) {
      done = false;
      alert('You need to answer question 1.');
    }
    else if ($("input[name=gender]:checked").val()== undefined) {
      done = false;
      alert('You need to answer question 2.');
    }
    else if ($("#age").val() == "" || isNaN($("#pNr").val()) == true) {
      done = false;
      alert('You need to answer question 3, using only digits.')
    }
    else if ($("input[name=psych_student]:checked").val() == undefined) {
      done = false;
      alert('You need to answer question 4.')
    }
    //---------------
    else if ($("#instrumentTime").val() == "") {
      done = false;
      alert('You need to answer question 5.');
    }
    else if ($("#instrumentLessonTime").val() == "") {
      done = false;
      alert('You need to answer question 6.');
    }
    else if ($("input[name=currentlyPlaying]:checked").val()== undefined) {
      done = false;
      alert('You need to answer question 7.');
    }
    else if ($("#timeSinceStopPlaying").val() == "" && $("input[name=currentlyPlaying]:checked").val()== "no") {
      done = false;
      alert('If you answered "No" on question 7, you need to specify how long ago you stopped playing below the question.');
    }
    else if ($("input[name=playingProficiency]:checked").val()== undefined) {
      done = false;
      alert('You need to answer all three parts of question 8.');
    }
    else if ($("input[name=sightReadingProficiency]:checked").val()== undefined) {
      done = false;
      alert('You need to answer all three parts of question 8.');
    }
    else if ($("input[name=byEarProficiency]:checked").val()== undefined) {
      done = false;
      alert('You need to answer all three parts of question 8.');
    }
    else if ($("input[name=musicTheory]:checked").val()== undefined) {
      done = false;
      alert('You need to answer question 9.');
    }
    else if ($("#musicTheoryText").val() == "" && $("input[name=musicTheory]:checked").val()== "yes") {
      done = false;
      alert('If you answered "Yes" on question 9, you need to write an answer in the box below.');
    }
    else if ($("input[name=otherInstrument]:checked").val()== undefined) {
      done = false;
      alert('You need to answer question 10.');
    }
    else if ($("#otherInstrumentText").val() == "" && $("input[name=otherInstrument]:checked").val()== "yes") {
      done = false;
      alert('If you answered "Yes" on question 10, you need to write an answer in the box below.');
    };    

    //---------- 
    if (done == true) {
      $('.button').unbind();
      timeStop = new Date().getTime();
      backgroundInputTime = (timeStop - timeStart); 
      firstTime = $("input[name=firstTime]:checked").val();
      sex = $("input[name=gender]:checked").val();
      age = $("#age").val();
      psych_student = $("input[name=psych_student]:checked").val(); 
      q_pianoTime = $("#pianoTime").val();
      q_pianoLessonTime = $("#pianoLessonTime").val();
      q_currentlyPlaying = $("input[name=currentlyPlaying]:checked").val();
      q_timeSinceStoppedPlaying = $("#timeSinceStopPlaying").val();
      q_playingProficiency = $("input[name=playingProficiency]:checked").val();
      q_sightReadingProficiency = $("input[name=sightReadingProficiency]:checked").val();
      q_byEarProficiency = $("input[name=byEarProficiency]:checked").val();
      q_musicTheory = $("input[name=musicTheory]:checked").val();
      q_musicTheoryText = $("#musicTheoryText").val();
      q_otherInstrument = $("input[name=otherInstrument]:checked").val();
      q_otherInstrumentText = $("#otherInstrumentText").val(); 
      pNrLoad(); // load the participant number and stuff like that
      expBlock();
    };
  });
}

// =============================================================== INFO ========================================================
function infoFunc(){
  timeStart = new Date().getTime();
  $('.allDiv').hide();

  if(blockArr[blockNr] == 'startInfo'){$('#startInfo').show();}
  else if(blockArr[blockNr] == 'noteReadingInfo'){$('#noteReadingInfo').show();}
  else if(blockArr[blockNr] == 'studyRatingInfo'){$('#studyRatingInfo').show();}
  else if(blockArr[blockNr] == 'testInfo'){$('#testInfo').show();}
  else if(blockArr[blockNr] == 'distInfo1'){$('#distInfo').show();}


  //Hovers
  $('.button').hover(function(){$(this).toggleClass('button_hover');});

  //Button that ends infoscreen
  $('.button').click(function(){
    
    $('.button').unbind();
    timeStop = new Date().getTime();

    if(blockArr[blockNr] == 'startInfo'){startInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'noteReadingInfo'){noteReadingInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'studyRatingInfo'){studyRatingInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'testInfo'){testInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'distInfo1'){distInfoTime1 = (timeStop - timeStart);}
    expBlock();
  });
}

// =============================================================== EXP BLOCK HANDLER ========================================================
function expBlock(){
  blockNr++;
  $('.overlay').hide();
  $('.allDiv').hide();

  setTimeout(function(){
    if (blockArr[blockNr] == 'startInfo'){
    infoFunc();
    console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'consent'){
      consentFunc(); 
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'backgroundInput'){
      backgroundInputFunc(); 
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'noteReadingInfo'){
      infoFunc(); 
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'noteReading'){
      noteReadingFunc(); 
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'studyRating'){
      studyRatingFunc(); 
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'studyRatingInfo'){
      infoFunc(); 
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'distInfo1'){
      infoFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'distraction1'){
      distFunc(1, distTime); //Block 1, time 10 seconds
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'testInfo') {
      infoFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'test'){
      recognitionTestFunc();
      console.log(blockArr[blockNr]);
    }
    else if((blockArr[blockNr] == 'afterExpQuestions')){
        afterExpInput();
        console.log(blockArr[blockNr]);
    }
    else if((blockArr[blockNr] == 'endInfo')){
        $('.allDiv').hide();
        $('#endInfo').show();
        console.log(blockArr[blockNr]);
    }
    else if((blockArr[blockNr] == 'checkPnumber')){
        console.log(blockArr[blockNr]);
        checkPnumber();
        
    }
    else if(blockArr[blockNr] == 'expEND'){
      console.log(blockArr[blockNr]);
      
      totalTimeStop = new Date().getTime();  //Measure how much time the exp took
      totalExpTime = totalTimeStop - totalTimeStart;
      
      addSameOnEachRowData();
  // ######################################################### Post to server ########################################################  
      outputFileName = "P" + participant + "_T" + dateAndTime.getHours() +"_"+ dateAndTime.getMinutes() +"_"+ dateAndTime.getSeconds() +"_"+ dateAndTime.getMilliseconds();
      
      if (firstTime == "no" || psych_student == "no" || previouslyUsedPnumber == "yes"){
        postDataToServer(convertToTSV(df), "output/extraParticipants/expData/" + outputFileName + "_df.tsv");
        postDataToServer(convertToTSV(distDf), "output/extraParticipants/distractionData/" + outputFileName + "_distraction.tsv");

        //append the persons information to the EE-file
        postDataToServer(EEString, "output/extraParticipants/additional/_EE.csv","yes"); 
      } else {
        postDataToServer(convertToTSV(df), "output/expData/" + outputFileName + "_df.tsv");
        postDataToServer(convertToTSV(distDf), "output/distractionData/" + outputFileName + "_distraction.tsv");
        
        //append the persons information to the EE-file
        postDataToServer(EEString, "output/additional/_EE.csv","yes"); 
      };
      expBlock();
    };
  },500);
};

// =============================================================== MAIN ========================================================
function main(){
  // capture backspace and tab key and prevent them from doing the default browser action
  window.addEventListener('keydown',function(e)
    {if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'||e.keyCode==8||e.keyIdentifier=='U+0009'||e.keyIdentifier=='Tab key'||e.keyCode==9){
      if(e.target==document.body){
        e.preventDefault();return false;}
      }
    }
    ,true);
  totalTimeStart = new Date().getTime();
  pNrLoad(); // REMOVE WHEN BACKGROUND FUNC IS INCLUDED
  expBlock();
  }
//When page is loaded, run the main function  
$(document).ready(main);