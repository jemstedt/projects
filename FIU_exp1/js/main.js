//ATT GÖRA:
//
//
//
//
//
//
//

// =============================================================== GLOBAL VARIABLES ========================================================

// <<<<<<<<<<<<<<<<<<<<<<<<<< Input & Output >>>>>>>>>>>>>>>>>>>>
var stim;
var df = [];
var items = [];
var pracItems = [];
var dateAndTime = new Date();
var participant;
var list; //EMPTY ON FINAL VERSION
var judgmentType = "EOL"; //EMPTY ON FINAL VERSION?
var firstTime; //EMPTY ON FINAL VERSION //first time participating in the experiment
var pNrArray = [];
var outputFileName = "";
var stimFileName = "data/FIU_24stim4prac_exp1.tsv";


// <<<<<<<<<<<<<<<<<<<<<<<<<< Participant Input >>>>>>>>>>>>>>>>>>>>

var consent;
var consentDate;
var sex;
var age;
var psych_student; //EMPTY ON FINAL VERSION?
var EEString = "";
var consentString = "";


// <<<<<<<<<<<<<<<<<<<<<<<<<< AFTER EXP Input >>>>>>>>>>>>>>>>>>>>

var belief = "x";
var firstEnglish = "x";
var languageText = "x";
var disturbed = "x";
var disturbedText = "x";
var ratingEffort = "x";
var studyEffort = "x";
var computerText = "x";


// <<<<<<<<<<<<<<<<<<<<<<<<<< General >>>>>>>>>>>>>>>>>>>>
var blockNr = 0;
//var blockArr = ['Beginning','consent','participantInput','startInfo','checkPnumber','expEND','endInfo'];
var blockArr = ['Beginning','consent','participantInput','startInfo','EOLRatingInfo','rating',
'studyInfo','study','distInfo1','distraction1','testInfo','freeRecall','afterExpQuestions','checkPnumber','expEND','endInfo'];


var totalTimeStart;
var totalTimeStop;
var totalExpTime;
var timeStart = 0;
var timeStop = 0;

var interStimTime = 500; // 500
var studyTime = 5000; //5000
var distTime = 30*1000; //30 seconds
var ratingTrialTime = 5000;
var freeRecallTotalTime = 180 * 1000; //3 minutes

//<<<<<<<<<<<<<<<<<<<<<<<<<< INFO-TIME >>>>>>>>>>>>>>>>>>>>
// - How long the participants takes to read the info
var consentTime = 0;
var startInfoTime = 0;
var ratingInfoTime = 0; 
var studyInfoTime = 0;
var testInfoTime = 0; 
var distInfoTime1 = 0; 
var participantInputTime = 0;

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
var studyItemArr = [];
var studyTimeArr = [];

// <<<<<<<<<<<<<<<<<<<<<<<<<< Rating >>>>>>>>>>>>>>>>>>>>
var ratingArr = [];
var ratingTimeArr = [];
var ratingItemArr = [];

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
        fluency : "x", practice : "x", itemNr : "x", item : "x", itemFreq : "x", presentedItem : "x",
        testResp : 'x', correct : 0, testRespOrder : 'x', testRespArr : 'x',testTimeArr : "x", judgmentType : "x", ratingItem : 'x', ratingTrial : "x", rating : "x", ratingTime : "x", studyTrial : "x", studyTime : 'x', studyItem : "x", 
        totalExpTime : "x", startInfoTime : 'x', participantInputTime : 'x', ratingInfoTime : 'x',
        studyInfoTime : 'x',testInfoTime : 'x',distInfoTime1 : 'x', psych_student : 'x', firstTime : 'x', consent : consent, consentTime : 'x',
        previouslyUsedPnumber : "x",
        belief : "x", firstEnglish : "x", languageText : "x", disturbed : "x", disturbedText : "x", ratingEffort : "x", studyEffort : "x", computerText : "x",
        screen_width : screen.width, screen_height : screen.height, screen_availWidth : screen.availWidth, screen_availHeight : screen.availHeight}
      );
  }
addConditionsToDF();
}

//Function randomly selecting half the items for high fluency and low fluency and then filling the output DF with modified items
function addConditionsToDF(){
  //assign either high or low fluency to the items
  var fluencyArr = [];
  var pracFluencyArr = [];
  var numberOfItems = 0;
  var numberOfPracs = 0;

  //Set index and info from stim file
  for(var i=0; i<df.length; i++){
    df[i].index = i;
    df[i].practice = stim[i].Prac;
    df[i].item = stim[i].Item;
    df[i].itemFreq = stim[i].ItemFreq;
    df[i].itemNr = stim[i].ItemNr;
  }

  //count items and practice items
  for(var i=0; i<(df.length); i++){
    if (df[i].practice == "no"){
      numberOfItems++
    }
    else if (df[i].practice == "yes"){
      numberOfPracs++; 
    };
  }

  // fluency for items
  for(var i=0; i<(numberOfItems/2); i++){
    fluencyArr.push("high");
    fluencyArr.push("low");
  }
  fluencyArr = _.shuffle(fluencyArr); 
  // fluency for practice items
  for(var i=0; i<(numberOfPracs/2); i++){
    pracFluencyArr.push("high");
    pracFluencyArr.push("low");
  }
  pracFluencyArr = _.shuffle(pracFluencyArr);
  
  // to keep track on how many items have been assigned so that the fluency condition is taken from the correct array
  var pracFluencyAssigned = 0;
  var itemFluencyAssigned = 0;

  //Set the fluency condition for every item
  for(var i=0; i<df.length; i++){
    if (df[i].practice == "no"){
      df[i].fluency = fluencyArr[itemFluencyAssigned];
      itemFluencyAssigned++;
    }
    else if (df[i].practice == "yes"){
      df[i].fluency = pracFluencyArr[pracFluencyAssigned];
      pracFluencyAssigned++;
    }
  };

  //Create high (all upper-case letters) and low fluency items (varying upper- and lower case letters)
  var inputItem = "";
  var outputItem = "";
  for(var i=0; i<df.length; i++){
    outputItem = "";
    inputItem = df[i].item;
    if (df[i].fluency == "high"){
      outputItem = inputItem.toUpperCase();
    }
    else if (df[i].fluency == "low") {
      for(var letter=0; letter<inputItem.length; letter++){
        if (letter % 2 == 1){
          outputItem = outputItem.concat(inputItem[letter].toUpperCase()); 
        } else {
          outputItem = outputItem.concat(inputItem[letter]);
        }
      }
    };

    df[i].presentedItem = outputItem;
  }


  //put items in arrays for easy access
  for(var i=0; i<df.length; i++){
    if (df[i].practice == "no"){
      items.push(df[i].presentedItem);
    }
    else if ((df[i].practice == "yes")) {
      pracItems.push(df[i].presentedItem);
    }
    
  }
} 

function testData(){
  var tempItem = "";
  var tempResp = "";
  for(var dfItem=0; dfItem<df.length; dfItem++){
    df[dfItem].testRespArr = testRespArr.join(", ");
    df[dfItem].testTimeArr = testTimeArr.join(", ");
    tempItem = df[dfItem].item;
    for(var testItem=0; testItem<testRespArr.length; testItem++){
      tempResp = testRespArr[testItem];
      if (tempItem.toLowerCase() == tempResp.toLowerCase()){
        df[dfItem].testResp = testRespArr[testItem];
        df[dfItem].correct = 1;
        if (df[dfItem].testRespOrder == "x"){
          df[dfItem].testRespOrder = testItem; 
        }
      }
    }
  }
}

function studyData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){
    for(var studyItem=0; studyItem<df.length; studyItem++){
      if (df[dfItem].presentedItem == studyItemArr[studyItem]){
        df[dfItem].studyTrial = studyItem;
        df[dfItem].studyItem = studyItemArr[studyItem];
        df[dfItem].studyTime = studyTimeArr[studyItem];
      }
    }
  }
}

function ratingData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){
    for(var rItem=0; rItem<df.length; rItem++){
      if (df[dfItem].presentedItem == ratingItemArr[rItem]){
        df[dfItem].ratingTrial = rItem;
        df[dfItem].ratingItem = ratingItemArr[rItem];
        df[dfItem].ratingTime = ratingTimeArr[rItem];
        df[dfItem].rating = ratingArr[rItem];
      }
    }
  }
}

function addSameOnEachRowData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){
    df[dfItem].startInfoTime = startInfoTime;
    df[dfItem].ratingInfoTime = ratingInfoTime;
    df[dfItem].studyInfoTime = studyInfoTime;
    df[dfItem].testInfoTime = testInfoTime;
    df[dfItem].distInfoTime1 = distInfoTime1;
    df[dfItem].participantInputTime = participantInputTime;
    df[dfItem].sex = sex;
    df[dfItem].age = age;
    df[dfItem].judgmentType = judgmentType;
    df[dfItem].participant = participant;
    df[dfItem].psych_student= psych_student;
    df[dfItem].firstTime = firstTime;
    df[dfItem].consent = consent;
    df[dfItem].consentTime = consentTime;
    df[dfItem].totalExpTime = totalExpTime;
    df[dfItem].belief = belief;
    df[dfItem].firstEnglish = firstEnglish;
    df[dfItem].languageText= languageText;
    df[dfItem].disturbed = disturbed;
    df[dfItem].disturbedText = disturbedText;
    df[dfItem].ratingEffort = ratingEffort;
    df[dfItem].studyEffort = studyEffort;
    df[dfItem].computerText = computerText;
    df[dfItem].previouslyUsedPnumber = previouslyUsedPnumber;
  };
};

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


//Participant number, not the same as Pnumber (change in next version of script)
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
// =============================================================== free recall ========================================================
function freeRecallFunc(){
  $('.allDiv').hide();
  $('#outerTest').show();

  //new Date().getTime();
  testRespArr = [];
  var respLog = "";
  written = "";
  timeStart = new Date().getTime();

  //Creates with the remaining time above the responsebox
  $('#testTime').text(freeRecallTotalTime/1000 + " seconds left");
  //Updates the time every 500 ms
  testStartTime = timeStart;
  var testTimerClock = setInterval(function() {
    $('#testTime').text(Math.ceil((freeRecallTotalTime - (new Date().getTime() - testStartTime)) / 1000) + " seconds left");
  }, 500);

  //End test-phase after freeRecallTotalTime
  var freeRecallTimeout = setTimeout(function () {
        $(document).unbind('keypress');
        $(document).unbind('keyup');

        if (written != ""){
          //Save how long it took to write the last item
          timeStop = new Date().getTime();
          //Add time to testTimeArr
          testTimeArr.push(timeStop - timeStart);
          testRespArr.push(written);
          written = "";
          }
        clearInterval(testTimerClock);
        testData();
        expBlock();
      }, freeRecallTotalTime)

  //capture keypresses
  $(document).on('keyup keypress', function(event){
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    //console.log("event.which:");
    //console.log(event.which);
    //console.log("event.type:");
    //console.log(event.type);
    if($('#middleTest').is(":visible")){
        if(event.which == 8 && written.length > 0) { //Backspace
          written = written.slice(0, -1);
          //console.log('sudda');
          $('#testInput').text(written); 
        }
        else if (event.which == 13){ // ENTER
          timeStop = new Date().getTime();
          if (written != ""){
            //Save how long it took to write the last item
            timeStop = new Date().getTime();
            //Add time to testTimeArr
            testTimeArr.push(timeStop - timeStart);

            testRespArr.push(written);
            respLog = respLog + " " + written;
            $('#respLog').text(respLog);
            written = "";
            $('#testInput').text(written);
            //Start counting time for next item
            timeStart = new Date().getTime();
          }
          console.log('ENTER');
        }
        else if (event.which == 9){ // TAB
          //NOTHING because im using a tab separated output
          console.log('TAB');
        }
        else if (event.type == 'keypress'){   
          console.log(event.charCode || event.keyCode);
          written += String.fromCharCode(event.charCode || event.keyCode);
          if (event.which != 13){
            $('#testInput').text(written);
            } 
        };
      };  
  });
}

// =============================================================== RATING ========================================================
function ratingFunc(){
  $('.allDiv').hide();
  $('#outerRating').show();

  $('#ratingQuestion').text("How likely is it that you will learn this word for the test?");
  
  var ratingShowArr = [];
  var ratingItemNr = 0;
  //practice items first and then the rest of the items
  ratingItemArr = _.shuffle(pracItems);
  ratingItemArr = ratingItemArr.concat(_.shuffle(items));

  ratingShowArr = ratingItemArr;
  
  timeStart = new Date().getTime();

  // <<<<<<<<<<<<<<<<<<<<<<<<<< Go through rating items >>>>>>>>>>>>>>>>>>>>ratingTrialTime
  function nextRating(){
    clearTimeout(ratingTimeout);
    ratingItemNr++;
    timeStop = new Date().getTime();
    ratingTimeArr.push(timeStop - timeStart);
    
    if (ratingShowArr.length > ratingItemNr) {
      console.log("ratingItemNr" + ratingItemNr); 
      $('#ratingStim').text(ratingShowArr[ratingItemNr]);  
    }
    

    //Interstim interval
    $('#middleRating').hide();
    setTimeout(function(){
      timeStart = new Date().getTime();
      //Write this so that the next item doesnt begin on 0 seconds before counting from ratingTrialTime again
      $('#ratingTime').text(ratingTrialTime/1000 + " seconds left");
      $('#middleRating').show();
      
      // Set a new timeout
      ratingTimeout = setTimeout(ratingTimeIsUp, ratingTrialTime);
      if (ratingShowArr.length == ratingItemNr) {
        clearInterval(ratingTimerClock);
        clearTimeout(ratingTimeout);
        ratingData();
        expBlock();
        $('.ratingButton').unbind();
      }
    }, interStimTime);
  }

  //function starting what to do when the time is up
  function ratingTimeIsUp (){
    nextRating();
    ratingArr.push("timeout")
  };
  //Show the first item
  console.log("ratingItemNr" + ratingItemNr);
  $('#ratingStim').text(ratingShowArr[ratingItemNr]);
  $('#ratingTime').text(ratingTrialTime/1000 + " seconds left");

  //Updates the time every 500 ms
  var ratingTimerClock = setInterval(function() {
    $('#ratingTime').text(Math.ceil((ratingTrialTime - (new Date().getTime() - timeStart)) / 1000) + " seconds left");
  }, 500);

  //Set a max time for each rating
  var ratingTimeout = setTimeout(ratingTimeIsUp, ratingTrialTime);

  //Buttons
  $('.ratingButton').hover(function(){$(this).toggleClass('button_hover');});
  $('#ratingB0').click(function(){ratingArr.push(0); nextRating()})
  $('#ratingB20').click(function(){ratingArr.push(20); nextRating()})
  $('#ratingB40').click(function(){ratingArr.push(40); nextRating()})
  $('#ratingB60').click(function(){ratingArr.push(60); nextRating()})
  $('#ratingB80').click(function(){ratingArr.push(80); nextRating()})
  $('#ratingB100').click(function(){ratingArr.push(100); nextRating()}) 
}


// =============================================================== STUDY ========================================================
function studyFunc(){
  $('.allDiv').hide();
  $('#outerStudy').show();
  studyItemArr = _.shuffle(items);


// <<<<<<<<<<<<<<<<<<<<<<<<<< Loop through study items >>>>>>>>>>>>>>>>>>>>
  var item = 0; //Start on first item
  function studyTimeLoop () {
    console.log("StudyItemNr" + item);
    $('#studyStim').text(studyItemArr[item]);


    timeStart = new Date().getTime();
    setTimeout(function () {
      item++;
      $('#studyStim').text("");
      timeStop = new Date().getTime();
      studyTimeArr.push(timeStop - timeStart);
      setTimeout(function () {
        if (item < studyItemArr.length) {
          studyTimeLoop();
        } else {
          expBlock();
          studyData();
        }
        }, interStimTime); 
      }, studyTime);
  };
  studyTimeLoop();
}
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
      pNumber = $("#pNr").val();
      consent = $("input[name=consentRadio]:checked").val();
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
      belief = $("input[name=belief]:checked").val();
      firstEnglish = $("input[name=firstEnglish]:checked").val();
      languageText = $("#languageText").val();
      disturbed = $("input[name=disturbed]:checked").val();
      disturbedText = $("#disturbedText").val();
      ratingEffort = $("input[name=ratingEffort]:checked").val();
      studyEffort = $("input[name=studyEffort]:checked").val();
      computerText = $("#computerText").val();
      $('.button').unbind();
      expBlock();
      }
  });
}

// =============================================================== PARTICIPANT INPUT ========================================================
function participantInputFunc(){
  var done = true;

  $('.allDiv').hide();
  $('.backgroundClass').show();

  $('#course_credit_form').show();
  timeStart = new Date().getTime();
  
  $("input[name='psych_student']").change(function(){
    if ($("input[name=psych_student]:checked").val() == 'yes' && $("input[name=firstTime]:checked").val() == 'yes'){
      $('#course_credit_form').show();
    }
    else {
      $('#course_credit_form').hide();
    }
  });
  $("input[name='firstTime']").change(function(){
    if ($("input[name=psych_student]:checked").val() == 'yes' && $("input[name=firstTime]:checked").val() == 'yes'){
      $('#course_credit_form').show();
    }
    else {
      $('#course_credit_form').hide();
    }
  });

  //Hovers
  $('.button').hover(function(){$(this).toggleClass('button_hover');});
  //Button-click
  $('.button').click(function(){
    done = true;

    if ($("input[name=firstTime]:checked").val()== undefined) {
      done = false;
      alert('Select whether or not this is the first time you participate in this study');
    }
    else if ($("input[name=gender]:checked").val()== undefined) {
      done = false;
      alert('Select your gender.');
    }
    else if ($("#age").val() == "" || isNaN($("#pNr").val()) == true) {
      done = false;
      alert('Write your age using only digits.')
    }
    else if ($("input[name=psych_student]:checked").val() == undefined) {
      done = false;
      alert('Select whether or not you are an undergraduate psychology student at Florida International University.')
    } 
    if (done == true) {
      $('.button').unbind();
      timeStop = new Date().getTime();
      participantInputTime = (timeStop - timeStart); 
      firstTime = $("input[name=firstTime]:checked").val();
      sex = $("input[name=gender]:checked").val();
      age = $("#age").val();
      psych_student = $("input[name=psych_student]:checked").val(); 

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
  else if(blockArr[blockNr] == 'studyInfo'){$('#studyInfo').show();}
  else if(blockArr[blockNr] == 'EOLRatingInfo'){$('#EOLRatingInfo').show();}
  else if(blockArr[blockNr] == 'testInfo'){$('#testInfo').show();}
  else if(blockArr[blockNr] == 'distInfo1'){$('#distInfo').show();}


  //Hovers
  $('.button').hover(function(){$(this).toggleClass('button_hover');});

  //Button that ends infoscreen
  $('.button').click(function(){
    
    $('.button').unbind();
    timeStop = new Date().getTime();

    if(blockArr[blockNr] == 'startInfo'){startInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'studyInfo'){studyInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'EOLRatingInfo'){ratingInfoTime = (timeStop - timeStart);}
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
    else if(blockArr[blockNr] == 'participantInput'){
      participantInputFunc(); 
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'rating'){
      ratingFunc(); 
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'EOLRatingInfo'){
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
    else if(blockArr[blockNr] == 'studyInfo'){
      infoFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'study'){
      studyFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'testInfo') {
      infoFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'freeRecall'){
      freeRecallFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'test'){
      cuedRecallFunc();
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
  expBlock();
  }
//When page is loaded, run the main function  
$(document).ready(main);