/* 
 * extension.js
 * Made by: Peter Morganelli and Brendan Roy with help from ChatGPT
 * 2/22/25
 * Purpose: Define the functionality for a VSCode extension called CodeClock
 *          for the JumboHack 2025 Hackathon. Upon entering "Start CodeClock Timer"
 *          the activeTime will measure how much time is spent actively coding
 *          and the idleTime will measure how much time is spent idle. These
 *          times are then sent to our backend server to be used on our frontend
 *          for the purposes of a leaderboard.
 */

const vscode = require('vscode');
const path = require('path');

let startTime = null;
let lastRecordedTime = Date.now();
let timerInitialized = false;
let email = "";
let doOver = false;
let sessionData = {
  fileData: { fileA: 0, fileB: 4 }, // time spent in each file in minutes
  trackingData: {
    keystrokeCt: 0,
    undoCt: 0,
    numKeyPresses: 0,
    
    // idle and active time are in milliseconds
    idleTime: 0,
    activeTime: 0

  }
};
// Idle threshold in milliseconds (idle time here is 1 minute)
const idleThreshold = 60000;
let totalTime = 0;

function startTimer() {
  if (!startTime) {
    startTime = Date.now();
  }
  lastRecordedTime = startTime;
}

function stopTimer() {
  if (startTime) {
    totalTime += Date.now() - startTime;
    startTime = null;
  }
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(Math.floor(seconds / 60) / 60);
  return `${hours} hours ${mins} mins ${seconds % 60} seconds`;
}

function recordActivity() {
  const currTime = Date.now();
  const delta = currTime - lastRecordedTime;
  if (delta > idleThreshold) {
    sessionData.trackingData.idleTime += delta;
    console.log(`Recorded idle time: ${delta} ms`);
  } else {
    sessionData.trackingData.activeTime += delta;
    console.log(`Recorded active time: ${delta} ms`);
  }
  lastRecordedTime = currTime;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const config = vscode.workspace.getConfiguration("CodeClock");
  const email = config.get('email');

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      // Get the full file path
      let filePath = editor.document.fileName;
      // Optionally, extract just the file name
      let fileName = path.basename(filePath);
      vscode.window.showInformationMessage(`Current file: ${fileName}`);
    }
});
    

  vscode.window.showInputBox({
        prompt: "Enter your email address; data will not be recorded without a valid email",
        validateInput: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? null : "Please enter a valid email address";
        }
  }).then((value) => {
        if (value) {
                let email = value;
                console.log(`yo check out the email: ${email}`);
        }
  })

  // Command to initialize CodeClock and start the timer.
  let codeClockCommand = vscode.commands.registerCommand('CodeClock', () => {
    if (!timerInitialized) {
      // Listen for window focus changes.
      context.subscriptions.push(
        vscode.window.onDidChangeWindowState((state) => {
          if (state.focused) {
            startTimer();
            recordActivity();
            lastRecordedTime = Date.now();
          } else {
            stopTimer();
          }
        })
      );

      // Listen for text document changes.
      context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(() => {
          recordActivity();
          lastRecordedTime = Date.now();
          if (!startTime && vscode.window.state.focused) {
            startTimer();
          }
        })
      );

      // Listen for selection changes (e.g., moving the cursor).
      context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(() => {
          recordActivity();
          lastRecordedTime = Date.now();
          if (!startTime && vscode.window.state.focused) {
            startTimer();
          }
        })
      );

      // Listen for visible range changes (e.g., scrolling).
      context.subscriptions.push(
        vscode.window.onDidChangeTextEditorVisibleRanges(() => {
          recordActivity();
          lastRecordedTime = Date.now();
          if (!startTime && vscode.window.state.focused) {
            startTimer();
          }
        })
      );

      /***********************************************************************/
	  /*                       COUNTING USER DATA                            */
	  /***********************************************************************/
	  //Measure how many key presses the user does
	  context.subscriptions.push(
		vscode.commands.registerCommand('type', async (args) => {
		  // Increment your keystroke counter
		  sessionData.trackingData.numKeyPresses++;
	  
		  // Forward the key event to the default type command so that text is still inserted
		  await vscode.commands.executeCommand('default:type', args);
		})
	  );

	  //count number of undos
	  context.subscriptions.push(
		vscode.commands.registerCommand('undo', async () => {
		  sessionData.trackingData.undoCt++;
		  await vscode.commands.executeCommand('default:undo');
		})
	  );
      

      //check for idle detection which triggers after a minute of no behavior
      const idleCheckInterval = setInterval(() => {
        if (startTime && (Date.now() - lastRecordedTime > idleThreshold)) {
          stopTimer();
          vscode.window.setStatusBarMessage("Idle: Timer paused", 60000);
        }
      }, 5000);
      context.subscriptions.push({ dispose: () => clearInterval(idleCheckInterval) });

      timerInitialized = true;
      //print message when timer starts
      vscode.window.showInformationMessage("CodeClock timer started!");
    } else {
      //if timer is already started, print a different message
      if (!doOver) {
        vscode.window.showInformationMessage("CodeClock timer is already running.");
      } else {
        startTimer();
        doOver = false;
        vscode.window.showInformationMessage("CodeClock timer started!");
      }
      
    }
  });
  context.subscriptions.push(codeClockCommand);

  // Command to show the tracked active time.
  let showTimeCommand = vscode.commands.registerCommand('extension.showTime', () => {
    if (!doOver) {
        stopTimer();
        vscode.window.showInformationMessage(`Active: ${formatTime(sessionData.trackingData.activeTime)}. \n
          								  Idle: ${formatTime(sessionData.trackingData.idleTime)}. \n
      									  Total: ${formatTime(sessionData.trackingData.activeTime + sessionData.trackingData.idleTime)}`);
    } else {
        vscode.window.showInformationMessage(`There is no CodeClock timer running.`);
    }
  });
  context.subscriptions.push(showTimeCommand);


// Create an output channel (usually at the top of your activate function)
  const outputChannel = vscode.window.createOutputChannel("CodeClock");

  let endTimeCommand = vscode.commands.registerCommand('extension.finishTime', () => {
    if (!doOver) {
        stopTimer();
        vscode.window.showInformationMessage(`Total time spent: ${formatTime(sessionData.trackingData.activeTime + sessionData.trackingData.idleTime)}. \n
										  Key presses: ${sessionData.trackingData.numKeyPresses}. \n
                                          Undos: ${sessionData.trackingData.undoCt}. \n
										  Thanks for using CodeClock!`);
        deactivate();
    } else {
        vscode.window.showInformationMessage(`There is no CodeClock timer running.`);
    }
  });
  context.subscriptions.push(endTimeCommand);
}

function deactivate() {
  //timerInitialized = false;
  sessionData.trackingData.keystrokeCt =  0;
    sessionData.trackingData.undoCt = 0;
    sessionData.trackingData.numKeyPresses = 0;
    
    // idle and active time are in milliseconds
    sessionData.trackingData.idleTime = 0;
    sessionData.trackingData.activeTime = 0;
    totalTime = 0;
    doOver = true;
    startTime = null;
}

module.exports = {
  activate,
  deactivate
};
