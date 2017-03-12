//Testkör en jävla massa
//Kolla alla texterna och uppdatera "ungefär 20 minuter"
//kommentera allting
//Ändra alla tider
//ta bort alla console.log som skulle kunna förstöra expet

// =============================================================== GLOBAL VARIABLES ========================================================

// <<<<<<<<<<<<<<<<<<<<<<<<<< Input & Output >>>>>>>>>>>>>>>>>>>>
var stim;
var df = [];
var items = [];
var dateAndTime = new Date();
var participant;
var condition; //EMPTY ON FINAL VERSION
var list; //EMPTY ON FINAL VERSION
var judgmentType; //EMPTY ON FINAL VERSION
var firstTime; //first time participating in the experiment
var pNrArray = [];
var outputFileName = "";


// <<<<<<<<<<<<<<<<<<<<<<<<<< Participant Input >>>>>>>>>>>>>>>>>>>>

var consent;
var sex;
var age;
var psychSU_student;
var wantEE = "";
var EEString = "";


// <<<<<<<<<<<<<<<<<<<<<<<<<< AFTER EXP Input >>>>>>>>>>>>>>>>>>>>

var recogItems = "x";
var disturbed = "x";
var ratingEffort = "x";
var studyEffort = "x";

// <<<<<<<<<<<<<<<<<<<<<<<<<< General >>>>>>>>>>>>>>>>>>>>
var blockNr = 0;

var blockArr = ['Beginning', 'consent','participantInput'];
var EOLBlockArr = ['Beginning', 'consent','participantInput','preStudyStartInfo','EOLRatingInfo','rating','distInfo1','distraction1',
'studyInfo','study','distInfo2','distraction2','testInfo','test','expEND','afterExpQuestions','endInfo'];

var ctJOLBlockArr = ['Beginning', 'consent','participantInput','postStudyStartInfo','studyInfo','study','distInfo1','distraction1',
'ctJOLRatingInfo','rating','distInfo2','distraction2','testInfo','test','expEND','afterExpQuestions','endInfo'];

var coJOLBlockArr = ['Beginning', 'consent','participantInput','postStudyStartInfo','studyInfo','study','distInfo1','distraction1',
'coJOLRatingInfo','rating','distInfo2','distraction2','testInfo','test','expEND','afterExpQuestions','endInfo'];

var totalTimeStart;
var totalTimeStop;
var totalExpTime;
var timeStart = 0;
var timeStop = 0;

var interStimTime = 500; // 500
var studyTime = 5000; //5000
var testTime = 15000 //15000
var distTime = 30000 //30000

//<<<<<<<<<<<<<<<<<<<<<<<<<< INFO-TIME >>>>>>>>>>>>>>>>>>>>
// - How long the participants takes to read the info
var consentTime = 0;
var startInfoTime = 0;
var ratingInfoTime = 0; 
var studyInfoTime = 0;
var testInfoTime = 0; 
var distInfoTime1 = 0; 
var distInfoTime2 = 0;
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


function emptyDfLengthOfStim(){
  //Create the empty data frame
  for(var i=0; i<stim.length; i++)
  {
    df.push({index : "x", date : dateAndTime.toDateString(), time : dateAndTime.toTimeString(), participant : participant, sex : 'x', age : 'x', condition : condition, itemNr : "x", item : "x", itemDiff : "x", list : "x"
        , judgmentType : "x", list : "x", ratingItem : 'x', ratingTrial : "x", rating : "x", ratingTime : "x", studyTrial : "x", studyTime : 'x', studyItem : "x", testTrial : "x", testItem : 'x', 
        testTime : "x", cue : "x", target : "x", testResp : 'x', correct : "x", totalExpTime : "x", startInfoTime : 'x', participantInputTime : 'x', ratingInfoTime : 'x',
        studyInfoTime : 'x',testInfoTime : 'x',distInfoTime1 : 'x', distInfoTime2 : 'x', psychSU_student : 'x', wantEE : 'x', firstTime : 'x', consent : consent, consentTime : 'x'}
      );
  }

  //Set index and info from stim file
  for(var i=0; i<df.length; i++){
    df[i].index = i;
    df[i].item = stim[i].Item;
    df[i].itemDiff = stim[i].ItemDiff;
    df[i].itemNr = stim[i].ItemNr;
  }

  //put items in an array for easy access
  for(var i=0; i<df.length; i++){
    items.push(df[i].item);
  }
}

function testData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){
    for(var testItem=0; testItem<df.length; testItem++){
      if (df[dfItem].item == testItemArr[testItem]){
        df[dfItem].testTrial = testItem;
        df[dfItem].testItem = testItemArr[testItem];
        df[dfItem].testResp = testRespArr[testItem];
        df[dfItem].cue = cueArr[testItem];
        df[dfItem].target = targetArr[testItem];
        df[dfItem].testTime= testTimeArr[testItem];
        if (testRespArr[testItem] == "") {
          df[dfItem].correct = 0;  
        } else if (testRespArr[testItem] == targetArr[testItem]){
           df[dfItem].correct = 1;
        }
      }
    }
  }
}

function studyData(){
  for(var dfItem=0; dfItem<df.length; dfItem++){
    for(var studyItem=0; studyItem<df.length; studyItem++){
      if (df[dfItem].item == studyItemArr[studyItem]){
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
      if (df[dfItem].item == ratingItemArr[rItem]){
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
    df[dfItem].distInfoTime2 = distInfoTime2;
    df[dfItem].participantInputTime = participantInputTime;
    df[dfItem].sex = sex;
    df[dfItem].age = age;
    df[dfItem].judgmentType = judgmentType;
    df[dfItem].list = list;
    df[dfItem].participant = participant;
    df[dfItem].psychSU_student= psychSU_student;
    df[dfItem].wantEE= wantEE;
    df[dfItem].firstTime = firstTime;
    df[dfItem].consent = consent;
    df[dfItem].consentTime = consentTime;
    df[dfItem].totalExpTime = totalExpTime;
  }
}

function pNrLoad(){
  //Select numberfile based on sex
  var filename ="";
  if (sex == "female"){
    filename = "data/femaleNr.tsv"
  }
  else if (sex == "male"){
    filename = "data/maleNr.tsv"
  }
  else if (sex == "annat"){
    filename = "data/annatNr.tsv"
  }
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
        condition = pNrArray[i].condition;
        break;
      }
    }

    //If all the numbers are used, then create a new number and randomly assign a condition.
    if (participant == undefined) {
      participant = 1000 + emergencyNr;
      condition = Math.round(Math.random()*6) + 1;
    }

  // Depending on the condition list and judgmentType are assigned
  if (condition == 1){
    list = "low";
    judgmentType = "EOL";
  }
  else if (condition == 2){
    list = "low";
    judgmentType = "ctJOL";
  }
  else if (condition == 3){
    list = "low";
    judgmentType = "coJOL";
  }
  else if (condition == 4){
    list = "high";
    judgmentType = "EOL";
  }
  else if (condition == 5){
    list = "high";
    judgmentType = "ctJOL";
  }
  else if (condition == 6){
    list = "high";
    judgmentType = "coJOL";
  };
  if (judgmentType == "EOL"){
    blockArr = EOLBlockArr;
  }  
  else if(judgmentType == "ctJOL"){
    blockArr = ctJOLBlockArr;
  }
  else if(judgmentType == "coJOL"){
    blockArr = coJOLBlockArr;
  };
  //Over write the participant number files with an updated version
  
  if (firstTime == "yes" && psychSU_student == "yes"){
    if (sex == "female"){
      postDataToServer(convertToTSV(pNrArray), "femaleNr.tsv");
    }
    else if (sex == "male"){
      postDataToServer(convertToTSV(pNrArray), "maleNr.tsv");
    }
    else if (sex == "annat"){
      postDataToServer(convertToTSV(pNrArray), "annatNr.tsv");
    }
  //Load stimuli from server
  }
  loadStim();
  loadDist(); 
  });
}

//Loading stimuli from a file
function loadStim(){
  var stimFileName = "";
  if (list == "low"){stimFileName = "data/low48.tsv";}
  else if (list == "high"){stimFileName = "data/high48.tsv";};
  d3.tsv(stimFileName, function(data){
    stim = data;
    
    //Fill the df array a number of outputRow objects equal to the number of stimuli
    emptyDfLengthOfStim();
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
function testFunc(){
  $('.allDiv').hide();
  $('#outerTest').show();
  
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
          clearTimeout(testTimer);
          clearTimeout(interStimTimer);
          nextTestItemFunc();
          //console.log('ENTER');
        };
      if (event.type == 'keypress'){   
          console.log(event.charCode || event.keyCode);
          written += String.fromCharCode(event.charCode || event.keyCode);
          $('#testInput').text(written); 
        }
      };  
  });

  var interStimTimer;
  var testTimer;

  testRespArr = [];
  testTimeArr = [];
  testItemArr = _.shuffle(items);

  //Fill the cue and target arrays
  for(var i=0; i<df.length; i++){
    cueAndTarget = testItemArr[i].split(" - ");
    cueArr.push(cueAndTarget[0]);
    targetArr.push(cueAndTarget[1]);
  }


  function nextTestItemFunc() {
    item++;
    $('#middleTest').hide(); 
    timeStop = new Date().getTime();
    testTimeArr.push(timeStop - timeStart);
    testRespArr.push(written.toLowerCase());
    interStimTimer = setTimeout(function () {
      if (item < testItemArr.length) {
         testTimeLoop();
      } else {
        $(document).unbind('keypress');
        $(document).unbind('keyup');
        testData();
        expBlock();
      }
    }, interStimTime)
  }
// <<<<<<<<<<<<<<<<<<<<<<<<<< Loop through test items >>>>>>>>>>>>>>>>>>>>
  var item = 0; //Start on first item
  function testTimeLoop () {
    $('.stim').text(cueArr[item] + " - ?");
    timeStart = new Date().getTime();
    written = "";
    $('#testInput').text(written.toLowerCase());
    $('#middleTest').show();
    //Change item after testTime amount of time
    testTimer = setTimeout(function () {
      nextTestItemFunc();   
    }, testTime);
  };
  testTimeLoop();

}
// =============================================================== RATING ========================================================
function ratingFunc(){
  $('.allDiv').hide();
  $('#outerRating').show();

  if (judgmentType == "EOL") {
    $('#ratingQuestion').text("Hur sannolikt är det att du kommer att lära dig ordparet till det kommande testet?");
  }
  else {
    $('#ratingQuestion').text("Hur sannolikt är det att du kommer att minnas ordparet på det kommande testet?");    
  }
  var ratingShowArr = [];
  var ratingItemNr = 0;
  ratingItemArr = _.shuffle(items);

  if (judgmentType == "coJOL"){
    //Fill the cue and target arrays
    for(var i=0; i<df.length; i++){
      cueAndTarget = ratingItemArr[i].split(" - ");
      ratingShowArr.push(cueAndTarget[0] + " - ?");
      //targetArr.push(cueAndTarget[1]);

    }
  }
  else {
    ratingShowArr = ratingItemArr;
  }

  timeStart = new Date().getTime();

  // <<<<<<<<<<<<<<<<<<<<<<<<<< Go through rating items >>>>>>>>>>>>>>>>>>>>
  function nextRating(){
    ratingItemNr++;
    timeStop = new Date().getTime();
    ratingTimeArr.push(timeStop - timeStart);

    $('#ratingStim').text(ratingShowArr[ratingItemNr]);
    $('#middleRating').hide();
    setTimeout(function(){
      $('#middleRating').show();
      timeStart = new Date().getTime();
      if (ratingShowArr.length == ratingItemNr) {
        ratingData();
        expBlock();
        $('.ratingButton').unbind();
      }
    }, interStimTime);
  }

  $('#ratingStim').text(ratingShowArr[ratingItemNr]);
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
    $('.consentFormButton').unbind();
    timeStop = new Date().getTime();
    consentTime = (timeStop - timeStart);
    consent = "yes";
    expBlock(); 
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
    if ($("input[name=ratingRating]:checked").val()== undefined) {
      done = false;
      alert('Du måste ange hur väl du tror att dina bedömningar stämmer överens med ditt resultat på minnestestet.');
    }
    else if ($("input[name=recogItems]:checked").val()== undefined) {
      done = false;
      alert('Du måste ange om du kände ingen något av ordparen från experiment du deltagit i tidigare.');
    }
    else if ($("input[name=disturbed]:checked").val()== undefined) {
      done = false;
      alert('Du måste ange om du blev störd på något sätt som kunde ha påverkat dina resultat.');
    }
    else if ($("input[name=disturbed]:checked").val()== "yes" && $("#disturbedText").val() == ""){
      done = false;
      alert('Du måste fylla i hur du blev störd.');
    }
    else if ($("input[name=ratingEffort]:checked").val()== undefined) {
      done = false;
      alert('Du måste ange hur mycket du ansträngde dig för att göra korrekta bedömningar.');
    }
    else if ($("input[name=studyEffort]:checked").val()== undefined) {
      done = false;
      alert('Du måste ange hur mycket du ansträngde dig för att lära dig ordparen när du studerade dem.');
    }

    if(done == true){
      ratingRating = $("input[name=ratingRating]:checked").val();
      recogItems = $("input[name=recogItems]:checked").val();
      disturbed = $("input[name=disturbed]:checked").val();
      disturbedText = $("#disturbedText").val();
      ratingEffort = $("input[name=ratingEffort]:checked").val();
      studyEffort = $("input[name=studyEffort]:checked").val();
      afterExpString = participant + "," + ratingRating + "," +recogItems + "," + disturbed+ "," + disturbedText + "," + ratingEffort + "," + studyEffort;
      $('.button').unbind();
      if (firstTime == "yes" && psychSU_student == "yes"){
        postDataToServer(afterExpString, "output/additional/_afterExpQuestions.csv","yes");
      }
      else if (firstTime == "no" || psychSU_student == "no"){
        postDataToServer(afterExpString, "output/extraParticipants/_afterExpQuestions.csv","yes"); 
      }
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
  
  $("input[name='psychSU_student']").change(function(){
    if ($("input[name=psychSU_student]:checked").val() == 'yes' && $("input[name=EE_radio]:checked").val() == 'yes' && $("input[name=firstTime]:checked").val() == 'yes'){
      $('#course_credit_form').show();
    }
    else {
      $('#course_credit_form').hide();
    }
  });
  $("input[name='EE_radio']").change(function(){
    if ($("input[name=EE_radio]:checked").val() == 'yes' && $("input[name=psychSU_student]:checked").val() == 'yes' && $("input[name=firstTime]:checked").val() == 'yes'){
      $('#course_credit_form').show();
    }
    else {
      $('#course_credit_form').hide();
    }
  });
  $("input[name='firstTime']").change(function(){
    if ($("input[name=psychSU_student]:checked").val() == 'yes' && $("input[name=EE_radio]:checked").val() == 'yes' && $("input[name=firstTime]:checked").val() == 'yes'){
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
      alert('Du måste ange om detta är första gången du deltar i studien.');
    }
    else if ($("input[name=gender]:checked").val()== undefined) {
      done = false;
      alert('Du måste ange ditt kön.');
    }
    else if ($("#age").val() == "") {
      done = false;
      alert('Du måste ange din ålder.')
    }
    else if ($("input[name=psychSU_student]:checked").val() == undefined) {
      done = false;
      alert('Du måste ange om du är student på Stockholms universitets psykologiska institution eller inte.')
    }
    else if ($("input[name=psychSU_student]:checked").val() == 'yes' && $("input[name=EE_radio]:checked").val() == 'yes' && $("input[name=firstTime]:checked").val() == 'yes') {
      if ($("#fname").val() == "") {
        done = false;
        alert('Du måste ditt förnamn.');
      }
      else if ($("#lname").val() == "") {
        done = false;
        alert('Du måste ditt efternamn.');
      }
      else if ($("#course").val() == "") {
        done = false;
        alert('Du måste ange vilken kurs du går.');
      }
      else if ($("#pNr").val() == "") {
        done = false;
        alert('Du måste ange de 6 första siffrorna i ditt personnummer.');
      }
    }  

    if (done == true) {
      $('.button').unbind();
      timeStop = new Date().getTime();
      participantInputTime = (timeStop - timeStart); 
      firstTime = $("input[name=firstTime]:checked").val();
      sex = $("input[name=gender]:checked").val();
      age = $("#age").val();
      psychSU_student = $("input[name=psychSU_student]:checked").val();
      wantEE = $("input[name=EE_radio]:checked").val();
      EEString = $("#fname").val() + "," + $("#lname").val() + "," + $("#course").val() + "," + $("#pNr").val();

      pNrLoad(); // load the participant number and stuff like that
      expBlock();
    };
  });
}

// =============================================================== INFO ========================================================
function infoFunc(){
  timeStart = new Date().getTime();
  $('.allDiv').hide();

  if(blockArr[blockNr] == 'preStudyStartInfo'){$('#preStudyStartInfo').show();}
  else if(blockArr[blockNr] == 'postStudyStartInfo'){$('#postStudyStartInfo').show();}
  else if(blockArr[blockNr] == 'studyInfo'){$('#studyInfo').show();}
  else if(blockArr[blockNr] == 'EOLRatingInfo'){$('#EOLRatingInfo').show();}
  else if(blockArr[blockNr] == 'ctJOLRatingInfo'){$('#ctJOLRatingInfo').show();}
  else if(blockArr[blockNr] == 'coJOLRatingInfo'){$('#coJOLRatingInfo').show();}
  else if(blockArr[blockNr] == 'testInfo'){$('#testInfo').show();}
  else if(blockArr[blockNr] == 'distInfo1'){$('#distInfo').show();}
  else if(blockArr[blockNr] == 'distInfo2'){$('#distInfo').show();}


  //Hovers
  $('.button').hover(function(){$(this).toggleClass('button_hover');});

  //Button that ends infoscreen
  $('.button').click(function(){
    
    $('.button').unbind();
    timeStop = new Date().getTime();

    if(blockArr[blockNr] == 'preStudyStartInfo'){startInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'postStudyStartInfo'){startInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'studyInfo'){studyInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'EOLRatingInfo'){ratingInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'ctJOLRatingInfo'){ratingInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'coJOLRatingInfo'){ratingInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'testInfo'){testInfoTime = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'distInfo1'){distInfoTime1 = (timeStop - timeStart);}
    else if(blockArr[blockNr] == 'distInfo2'){distInfoTime2 = (timeStop - timeStart);}  
    expBlock();
  });
}

// =============================================================== EXP BLOCK HANDLER ========================================================
function expBlock(){
  blockNr++;
  $('.overlay').hide();
  $('.allDiv').hide();

  setTimeout(function(){
    if (blockArr[blockNr] == 'preStudyStartInfo'){
    infoFunc();
    console.log(blockArr[blockNr]);
    }
    else if (blockArr[blockNr] == 'postStudyStartInfo'){
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
    else if(blockArr[blockNr] == 'ctJOLRatingInfo'){
      infoFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'coJOLRatingInfo'){
      infoFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'distInfo1'){
      infoFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'distInfo2'){
      infoFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'distraction1'){
      distFunc(1, distTime); //Block 1, time 10 seconds
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'distraction2'){
      distFunc(2, distTime); //Block 1, time 5 seconds
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
    else if(blockArr[blockNr] == 'test'){
      testFunc();
      console.log(blockArr[blockNr]);
    }
    else if(blockArr[blockNr] == 'expEND'){
      console.log(blockArr[blockNr]);
      
      totalTimeStop = new Date().getTime();  //Measure how much time the exp took
      totalExpTime = totalTimeStop - totalTimeStart;
      
      addSameOnEachRowData();
  // ######################################################### Post to server ########################################################  
      outputFileName = "P" + participant + "_C" + condition + "_T" + dateAndTime.getHours() +"_"+ dateAndTime.getMinutes() +"_"+ dateAndTime.getSeconds() +"_"+ dateAndTime.getMilliseconds();
      if (firstTime == "yes" && psychSU_student == "yes"){
        postDataToServer(convertToTSV(df), "output/expData/" + outputFileName + "_df.tsv");
        postDataToServer(convertToTSV(distDf), "output/distractionData/" + outputFileName + "_distraction.tsv");
        
        //append the persons information to the EE-file
        if (wantEE == "yes" && psychSU_student == "yes"){
          postDataToServer(EEString, "output/additional/_EE.csv","yes"); 
        }
      }
      else if (firstTime == "no" || psychSU_student == "no"){
        postDataToServer(convertToTSV(df), "output/extraParticipants/expData/" + outputFileName + "_df.tsv");
        postDataToServer(convertToTSV(distDf), "output/extraParticipants/distractionData/" + outputFileName + "_distraction.tsv");
      }
      expBlock();
    }
    else if((blockArr[blockNr] == 'afterExpQuestions')){
        afterExpInput();
        console.log(blockArr[blockNr]);
    }
    else if((blockArr[blockNr] == 'endInfo')){
        $('.allDiv').hide();
        $('#endInfo').show();
        console.log(blockArr[blockNr]);
    };
    },500);
  
}

// =============================================================== MAIN ========================================================
function main(){
  window.addEventListener('keydown',function(e)
    {if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'||e.keyCode==8){
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