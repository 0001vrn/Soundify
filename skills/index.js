var aws = require('aws-sdk');
var soundDict = {
    Cat:'Cat_Kitten',
    Chimpanzee:'Chimpanzee',
    Cow:'Cow',
    Crickets:'Crickets',
    Dog:'Dog',
    Dolphin:'Dolphin',
    Duck:'Duck',
    Horse:'Horse_Walk',
    Lion:'Lion',
    Pig:'Pig',
    Rooster:'Rooster',
    Sheep:'Sheep'
};
var LevelStatus = {
    NOT_DONE:0,
    DONE:2
};
var LevelName = [
    'Easy',
    'Medium',
    'Hard'
]
var Levels = {
    Easy:0,
    Medium:1,
    Hard:2
};

var soundDictIndexed = [ 
    'Cat_Kitten', 
    'Chimpanzee', 
    'Cow',
    'Crickets',
    'Dog',
    'Dolphin',
    'Duck',
    'Horse_Walk',
    'Lion',
    'Pig',
    'Rooster',
    'Sheep'
];

var easyDict = [
    'Lion',
    'Dog',
    'Duck'
];

var mediumDict = [
    'Chimpanzee',
    'Sheep',
    'Pig'
];

var hardDict = [
    'Crickets',
    'Dolphin',
    'Rooster'
];
var easyIdx = 0;
var mediumIdx = 0;
var hardIdx = 0;
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * This validates that the applicationId matches what is provided by Amazon.
         */
        if (event.session.application.applicationId !== "amzn1.ask.skill.c29b5e46-8768-489f-8b0b-f25b00f1bfa7") {
             context.fail("Invalid Application ID");
        }
        

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(session, callback);
}

/**
 * Called when the user specifies an intent for this skill. This drives
 * the main logic for the function.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
        
    console.log("processing " + intentName);

    // Dispatch to the individual skill handlers
    
    if("PlayEasy" === intentName){
        //play easy game
        easyGame(intent, session, callback);
    } else if("AnsEasy" === intentName){
        //answer easy
        ansEasy(intent, session, callback);
    } else if("PlayMedium" === intentName){
        //play medium game
        mediumGame(intent, session, callback);
    } else if("AnsMedium" === intentName){
        //answer medium
        ansMedium(intent, session, callback);
    } else if("PlayHard" === intentName){
        //play hard game
        hardGame(intent, session, callback);
    } else if("AnsHard" === intentName){
        //ans hard
        ansHard(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        getWelcomeResponse(session, callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

function easyGame(intent, session, callback){
    var sessionAttributes = { };
    var shouldEndSession = false;
    var cardTitle = "Play Easy";

    console.log("Easy Mode Invoked");
    
    // this incrementally constructs the SSML message combining voice in text into the same output stream
    if(easyIdx > 2){
        //easy game ended
        console.log("Easy Mode ended");
        var audioOutput = "<speak>";
        
        audioOutput = audioOutput + "You have completed this level, please switch to next level. ";
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));
    }else{
        //continue playing easy game
        var audioOutput = "<speak>";
        if(easyIdx == 0)
            audioOutput = audioOutput +  "Looks like you have chosen "+ LevelName[Levels.Easy] +" as level of difficulty. ";
        
        audioOutput = audioOutput + "<say-as interpret-as='interjection'>Hola!</say-as> ";
        audioOutput = audioOutput + "In a few moments, you will hear a sound of an animal. ";
        audioOutput = audioOutput + "You have to identify the animal. ";
        audioOutput = audioOutput + "<say-as interpret-as='interjection'>See!</say-as> Its that easy. <break time=\"2s\" />";
        
        audioOutput = audioOutput + "<audio src=\"https://s3.amazonaws.com/soundify/alexa-compatible-sounds/animals/"+easyDict[easyIdx];
        audioOutput = audioOutput + ".mp3\" />";

        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));

    }
    
}

function ansEasy(intent, session, callback){
    var sessionAttributes = { easyIdx };
    var shouldEndSession = false;
    var cardTitle = "Ans Easy";

    console.log("Ans Easy Mode Invoked " + intent.slots.EasyAnimals.value);

    //use slot value to verify the animal name spoken
    if(isCorrectResponse(Levels.Easy, easyIdx, intent.slots.EasyAnimals.value))
    {
        //update easyIdx on each correct response
        easyIdx = easyIdx + 1;

        var audioOutput = "<speak>";
        audioOutput = audioOutput +  "<say-as interpret-as='interjection'>Wow!</say-as> Correct Answer. ";
        if(easyIdx > 2){
            //easy game ended
            audioOutput = audioOutput +  "<say-as interpret-as='interjection'>Congratulations!</say-as> You have successfully completed the "+ LevelName[Levels.Easy] +" level. ";
            audioOutput = audioOutput +  "Say "+ LevelName[Levels.Medium] +" or "+ LevelName[Levels.Hard] +" to change the level of difficulty. ";
        } else{
            audioOutput = audioOutput +  "Say "+ LevelName[Levels.Easy] +" again to hear the sound of next animal. ";
        }
        //output speech response like cheers or hurray
        console.log("Correct response " + easyIdx);
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";
        
        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));

    } else{
        //output speech response like try again
        console.log("Incorrect response");
        var audioOutput = "<speak>";
            audioOutput = audioOutput +  "Inorrect Answer. ";        
            audioOutput = audioOutput +  "Say the name again. ";
    
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));
    }
    
}

function mediumGame(intent, session, callback){
    var sessionAttributes = { };
    var shouldEndSession = false;
    var cardTitle = "Play Medium";

    console.log("Medium Mode Invoked");
    
    // this incrementally constructs the SSML message combining voice in text into the same output stream
    if(mediumIdx > 2){
        //medium game ended
        console.log("Medium Mode ended");
        var audioOutput = "<speak>";
        
        audioOutput = audioOutput + "You have completed this level, please switch to next level. ";
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));

    }else{
        //continue playing medium game
        var audioOutput = "<speak>";
        if(mediumIdx == 0)
            audioOutput = audioOutput +  "Looks like you have chosen "+ LevelName[Levels.Medium] +" as level of difficulty. ";
        
        audioOutput = audioOutput + "<say-as interpret-as='interjection'>Hola!</say-as> ";
        audioOutput = audioOutput + "In a few moments, you will hear a sound of an animal. ";
        audioOutput = audioOutput + "You have to identify the animal. ";
        audioOutput = audioOutput + "<say-as interpret-as='interjection'>See!</say-as> Its that easy. <break time=\"2s\" />";
        
        audioOutput = audioOutput + "<audio src=\"https://s3.amazonaws.com/soundify/alexa-compatible-sounds/animals/"+mediumDict[mediumIdx];
        audioOutput = audioOutput + ".mp3\" />";

        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));

    }
    
}
function ansMedium(intent, session, callback){
    var sessionAttributes = { mediumIdx };
    var shouldEndSession = false;
    var cardTitle = "Ans medium";

    console.log("Ans medium Mode Invoked " + intent.slots.MediumAnimals.value);

    //use slot value to verify the animal name spoken
    if(isCorrectResponse(Levels.Medium, mediumIdx, intent.slots.MediumAnimals.value))
    {
        //update mediumIdx on each correct response
        mediumIdx = mediumIdx + 1;

        var audioOutput = "<speak>";
        audioOutput = audioOutput +  "<say-as interpret-as='interjection'>Wow!</say-as> Correct Answer. ";
        if(mediumIdx > 2){
            //medium game ended
            audioOutput = audioOutput +  "<say-as interpret-as='interjection'>Congratulations!</say-as> You have successfully completed the medium level. ";
            audioOutput = audioOutput +  "Say "+ LevelName[Levels.Easy] +" or "+ LevelName[Levels.Hard] +" to change the level of difficulty. ";
        } else{
            audioOutput = audioOutput +  "Say "+ LevelName[Levels.Medium] +" again to hear the sound of next animal. ";
        }
        //output speech response like cheers or hurray
        console.log("Correct response " + mediumIdx);
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";
        
        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));

    } else{
        //output speech response like try again
        console.log("Incorrect response");
        var audioOutput = "<speak>";
            audioOutput = audioOutput +  "Inorrect Answer. ";        
            audioOutput = audioOutput +  "Say the name again. ";
    
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));
    }
}
function hardGame(intent, session, callback){
    var sessionAttributes = { };
    var shouldEndSession = false;
    var cardTitle = "Play Hard";

    console.log("Hard Mode Invoked");
    
    // this incrementally constructs the SSML message combining voice in text into the same output stream
    if(hardIdx > 2){
        //hard game ended
        console.log("Hard Mode ended");
        var audioOutput = "<speak>";
        
        audioOutput = audioOutput + "You have completed all the levels, say goodbye to end the game.";
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));

    }else{
        //continue playing hard game
        var audioOutput = "<speak>";
        if(hardIdx == 0)
            audioOutput = audioOutput +  "Looks like you have chosen "+ LevelName[Levels.Hard] +" as level of difficulty. ";
        
        audioOutput = audioOutput + "<say-as interpret-as='interjection'>Hola!</say-as> ";
        audioOutput = audioOutput + "In a few moments, you will hear a sound of an animal. ";
        audioOutput = audioOutput + "You have to identify the animal. ";
        audioOutput = audioOutput + "<say-as interpret-as='interjection'>See!</say-as> Its that easy. <break time=\"2s\" />";
        
        audioOutput = audioOutput + "<audio src=\"https://s3.amazonaws.com/soundify/alexa-compatible-sounds/animals/"+hardDict[hardIdx];
        audioOutput = audioOutput + ".mp3\" />";

        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));

    }
}
function ansHard(intent, session, callback){
    var sessionAttributes = { hardIdx };
    var shouldEndSession = false;
    var cardTitle = "Ans hard";

    console.log("Ans hard Mode Invoked " + intent.slots.HardAnimals.value);

    //use slot value to verify the animal name spoken
    if(isCorrectResponse(Levels.Hard, hardIdx, intent.slots.HardAnimals.value))
    {
        //update hardIdx on each correct response
        hardIdx = hardIdx + 1;

        var audioOutput = "<speak>";
        audioOutput = audioOutput +  "<say-as interpret-as='interjection'>Wow!</say-as> Correct Answer. ";
        if(hardIdx > 2){
            //easy game ended
            audioOutput = audioOutput +  "<say-as interpret-as='interjection'>Congratulations!</say-as> You have successfully completed the "+ LevelName[Levels.Hard] +" level. ";
            audioOutput = audioOutput +  "Say "+ LevelName[Levels.Easy] +" or "+ LevelName[Levels.Medium] +" to change the level of difficulty. ";
        } else{
            audioOutput = audioOutput +  "Say "+ LevelName[Levels.Hard] +" again to hear the sound of next animal. ";
        }
        //output speech response like cheers or hurray
        console.log("Correct response " + hardIdx);
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";
        
        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));

    } else{
        //output speech response like try again
        console.log("Incorrect response");
        var audioOutput = "<speak>";
            audioOutput = audioOutput +  "Inorrect Answer. ";        
            audioOutput = audioOutput +  "Say the name again. ";
    
        
        audioOutput = audioOutput + "</speak>";

        var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
            "on sounds prompted through your Alexa.";

        var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa.";

        var repromptText = "You can go back to main menu by saying begin.";

        callback(sessionAttributes,
                buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));
    }
}

function isCorrectResponse(level, idx, animalName){
    
    if(level == Levels.Easy){
        //easy
        return easyDict[idx].toLowerCase() === animalName;
    } else if(level == Levels.Medium){
        //medium
        return mediumDict[idx].toLowerCase() === animalName;
    } else if(level == Levels.Hard){
        //hard
        return hardDict[idx].toLowerCase() === animalName;  
    }

    return false;
}
/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

// --------------- Base Functions that are invoked based on standard utterances -----------------------

// this is the function that gets called to format the response to the user when they first boot the app

function getWelcomeResponse(session, callback) {
    var sessionAttributes = {};
    var shouldEndSession = false;
    var cardTitle = "Welcome to Soundify";

    console.log("Welcome Message Invoked");
    var idx = getRandomArbitrary(0,soundDictIndexed.length);
    console.log(idx);
    // this incrementally constructs the SSML message combining voice in text into the same output stream
    console.log(soundDictIndexed[idx]);

    var audioOutput = "<speak>";
        audioOutput = audioOutput +  "Welcome to Soundify. ";
        audioOutput = audioOutput + "Your tool for identifying the sound based " +
            "on sound prompt given by Alexa. You will hear a sound prompt like this one. <break time=\"1s\" />";
        audioOutput = audioOutput + "<audio src=\"https://s3.amazonaws.com/soundify/alexa-compatible-sounds/animals/"+soundDictIndexed[idx];
        audioOutput = audioOutput + ".mp3\" />";    
        audioOutput = audioOutput + "<break time=\"1s\" /> Let's get started by choosing a difficulty level. " +
            "Just say something like easy, medium or hard.";
        audioOutput = audioOutput + "</speak>";

    var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
        "on sounds prompted through your Alexa.";

    var cardOutput = "Welcome to Soundify. Your tool for identifying the sounds given through Alexa. ";

    var repromptText = "Please start by choosing a difficulty level. " +
        "For example, say something like easy, medium or hard. ";

    
    callback(sessionAttributes,
            buildAudioResponse(cardTitle, audioOutput, cardOutput, repromptText, shouldEndSession));
}

// this is the function that gets called to format the response to the user when they ask for help
function getHelpResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Help";
    // this will be what the user hears after asking for help

    console.log("Help Message Invoked");

    var speechOutput = "Welcome to Soundify. Your tool for identifying the sound based " +
        "on sounds prompted through your Alexa. ";
    speechOutput = speechOutput + "At any point, you can end the session by just saying goodbye. ";

    speechOutput = speechOutput + "However, to play, you must say begin. "; 
        
    // if the user still does not respond, they will be prompted with this additional information

    var repromptText = "Please start by choosing a difficulty level. " +
        "For example, say something like easy, medium or hard. ";
        
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, speechOutput, repromptText, shouldEndSession));
}
function isClearedAllLevels(){
    return (easyIdx == LevelStatus.DONE && mediumIdx == LevelStatus.DONE && hardIdx == LevelStatus.DONE); 
} 
// this is the function that gets called to format the response when the user is done
function handleSessionEndRequest(callback) {
    var speechOutput = '';
    if(isClearedAllLevels()){
        speechOutput = speechOutput + "Congratulations on successful completion of each level. ";
    }
    else{

    }
    var cardTitle = "Thanks for using Soundify";
    speechOutput = speechOutput + "Thank you for trying out Soundify. Please take a moment to comment on the skill " +
        "within the app on your mobile device to provide feedback on how we can improve. Have a nice day!";
        
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, speechOutput, null, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, cardInfo, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: cardInfo
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildAudioResponse(title, output, cardInfo, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: output
        },
        card: {
            type: "Simple",
            title: title,
            content: cardInfo
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildAudioCardResponse(title, output, cardInfo, objectName, repromptText, shouldEndSession) {
    var smallImagePath = "https://s3.amazonaws.com/soundify/store_icons/icon_108.png";
    var largeImagePath = "https://s3.amazonaws.com/soundify/store_icons/icon_512.png";
    return {
        outputSpeech: {
            type: "SSML",
            ssml: output
        },
        card: {
            type: "Standard",
            title: title,
            text: cardInfo,
            image: {
                smallImageUrl: smallImagePath,
                largeImageUrl: largeImagePath
            }
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
