const vscode = require('vscode');

let startTime = null;
let totalTime = 0;
let lastActivityTime = Date.now();
let timerInitialized = false;
let sessionData = {
    fileData: {fileA: 0, fileB: 4 }, //time spent in each file in minutes
    trackingData: {
    keystrokeCt: 0,
    undoCt: 0,
    clickCt: 0,
    copyCutPasteCt: 0,
    deleteCt: 0
  }
}
// Idle threshold in milliseconds (can be configured as described earlier)
const idleThreshold = 600000; //idle time here is 10 minutes

function startTimer() {
  if (!startTime) {
    startTime = Date.now();
  }
}

function stopTimer() {
  if (startTime) {
    totalTime += Date.now() - startTime;
    startTime = null;
  }
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const mins = (Math.floor(seconds / 60)) % 60;
  const hours = Math.floor(mins / 60);
//   const secs = seconds % 60;
  return `${hours} hours ${mins} mins`;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  vscode.window.onDidChangeActiveTextEditor((editor) => {
	console.log("Got here");
	if (editor) {
	  // Get the full file path
	  let filePath = editor.document.fileName;
	  // Optionally, extract just the file name
    vscode.window.showInformationMessage(`Current file: ${filePath}`);
	  // Update your variable or state as needed here
	}
  });

  // Command to initialize CodeClock and start the timer.
  let codeClockCommand = vscode.commands.registerCommand('CodeClock', () => {
    if (!timerInitialized) {
      // Listen for window focus changes.
      context.subscriptions.push(
        vscode.window.onDidChangeWindowState((state) => {
          if (state.focused) {
            startTimer();
            lastActivityTime = Date.now();
          } else {
            stopTimer();
          }
        })
      );

      // Listen for text document changes.
      context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(() => {
          lastActivityTime = Date.now();
          if (!startTime && vscode.window.state.focused) {
            startTimer();
          }
        })
      );

      // Listen for selection changes (e.g., moving the cursor).
      context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(() => {
          lastActivityTime = Date.now();
          if (!startTime && vscode.window.state.focused) {
            startTimer();
          }
        })
      );

      // Listen for visible range changes (e.g., scrolling).
      context.subscriptions.push(
        vscode.window.onDidChangeTextEditorVisibleRanges(() => {
          lastActivityTime = Date.now();
          if (!startTime && vscode.window.state.focused) {
            startTimer();
          }
        })
      );
      
    //   context.subscriptions.push(
    //     vscode.window.onDidChangeWindowState();
	// 	let fileName = vscode.window.activeTextEditor.document.fileName;
    //   )

      // Idle detection: check at a reasonable frequency.
      const idleCheckInterval = setInterval(() => {
        if (startTime && (Date.now() - lastActivityTime > idleThreshold)) {
          stopTimer();
          vscode.window.setStatusBarMessage("Idle: Timer paused", 3000);
        }
      }, 5000);
      context.subscriptions.push({ dispose: () => clearInterval(idleCheckInterval) });

      timerInitialized = true;
      vscode.window.showInformationMessage("CodeClock timer started!");
    } else {
      vscode.window.showInformationMessage("CodeClock timer is already running.");
    }
  });
  context.subscriptions.push(codeClockCommand);

  // Command to show the tracked active time.
  let showTimeCommand = vscode.commands.registerCommand('extension.showTime', () => {
    if (startTime) stopTimer();
    vscode.window.showInformationMessage(`Total active time: ${formatTime(totalTime)}`);
  });
  context.subscriptions.push(showTimeCommand);


  let endTimeCommand = vscode.commands.registerCommand('extension.finishTime', () => {
    if (startTime) stopTimer();
    vscode.window.showInformationMessage(`Total Time is: ${formatTime(totalTime)}. Thanks for using CodeClock!`);
  });
  context.subscriptions.push(endTimeCommand);
}

function deactivate() {
  stopTimer();
}

module.exports = {
  activate,
  deactivate
};
