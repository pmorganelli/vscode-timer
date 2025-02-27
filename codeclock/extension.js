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
const fs = require('fs');



let timerInitialized = false;
let email = "";
let doOver = false;

class file {
    constructor(filename) {
        this.name = filename;
        this.undoCt = 0;
        this.numKeyPresses = 0;
        this.pasteCount = 0;
        this.copyCount = 0;
        this.cutCount = 0;
        this.idleTime = 0;
        this.activeTime = 0;
        this.lastRecordedTime = Date.now();
        this.startTime = Date.now();
    }
}
let fileData = [];
let currFile = null;

// let sessionData = {
//     fileData: { fileA: 0, fileB: 4 }, // time spent in each file in minutes
//     trackingData: {
//         keystrokeCt: 0,
//         undoCt: 0,
//         numKeyPresses: 0,
//         pasteCount: 0,

//         // idle and active time are in milliseconds
//         idleTime: 0,
//         activeTime: 0,
//         offCodeTime: 0
//     }
// };
// Off vscode time that still counts toward idle time (maximum is 20 minutes)
const maxOffCode = 300000
// Idle threshold in milliseconds (idle time here is 1 minute)
const idleThreshold = 60000;
let totalTime = 0;

function startTimer() {
    if (currFile.offCodeTime) {
        let timeOff = Date.now() - currFile.offCodeTime;
        console.log(`TIMEOFF: ${timeOff}`);
        currFile.idleTime += (timeOff > maxOffCode) ? maxOffCode : timeOff;
        currFile.offCodeTime = 0;
    }

    // if (!currFile.startTime) {
    currFile.startTime = Date.now();
    // }
    currFile.lastRecordedTime = currFile.startTime;
}
function startOffCodeTimer() {
    currFile.offCodeTime = Date.now();

}
function stopTimer() {
    if (currFile.startTime) {
        //totalTime += Date.now() - currFile.startTime;
        currFile.startTime = null;
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
    const delta = currTime - currFile.lastRecordedTime;
    if (delta > idleThreshold) {
        currFile.idleTime += (delta - idleThreshold);
        currFile.activeTime += idleThreshold;
        console.log(`Recorded idle time: ${delta} ms`);
    } else {
        currFile.activeTime += delta;
        console.log(`Recorded active time: ${delta} ms`);
    }
    currFile.lastRecordedTime = currTime;
}
function exportAsCSV() {
    const exportPath = path.join(__dirname, 'CodeClockData.csv'); // Define file path
    let csvContent = "File Name, Active Time (ms), Idle Time (ms), Total Time (ms), Copy, Cut, Paste, Undo\n"; // CSV headers
    let totalTime = 0;
    let totalActive = 0;
    let totalIdle = 0;
    let totalCopy = 0;
    let totalPaste = 0;
    let totalCut = 0;
    let totalUndo = 0;
    for (let curr of fileData) {
        let currTotal = curr.activeTime + curr.idleTime;
        csvContent += `${curr.name},${curr.activeTime},${curr.idleTime},${currTotal}, ${curr.copyCount}, ${curr.cutCount}, ${curr.pasteCount}, ${curr.undoCt}\n`;
        totalActive += curr.activeTime;
        totalIdle += curr.idleTime;
        totalTime += curr.activeTime + curr.idleTime;
        totalCopy += curr.copyCount;
        totalPaste += curr.pasteCount;
        totalCut += curr.cutCount;
        totalUndo += curr.undoCt;
    }
    csvContent += `Totals: ,${totalActive},${totalIdle},${totalTime}, ${totalCopy}, ${totalCut}, ${totalPaste}, ${totalUndo}`

    fs.writeFile(exportPath, csvContent, (err) => {
        if (err) {
            vscode.window.showErrorMessage("Failed to save CodeClock data.");
        } else {
            vscode.window.showInformationMessage(`CodeClock data saved to ${exportPath}`);
        }
    });
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const config = vscode.workspace.getConfiguration("CodeClock");
    const email = config.get('email');

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        recordActivity();
        if (editor) {
            // Get the full file path
            let filePath = editor.document.fileName;
            // Optionally, extract just the file name
            let fileName = path.basename(filePath);
            for (let curr of fileData) {
                if (curr.name === fileName) {
                    currFile = curr;
                    currFile.lastRecordedTime = Date.now();
                    currFile.startTime = Date.now();
                    break;
                } else if (curr === fileData[fileData.length - 1]) {
                    fileData.push(new file(fileName));
                    currFile = fileData[fileData.length - 1];
                }
            }
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
        fileData.push(new file(path.basename(vscode.window.activeTextEditor.document.fileName)));
        currFile = fileData[0];
        if (!timerInitialized || !doOver) {
            doOver = false;
            // Listen for window focus changes.
            context.subscriptions.push(
                vscode.window.onDidChangeWindowState((state) => {
                    if (state.focused) {
                        startTimer();
                        currFile.lastRecordedTime = Date.now();
                        recordActivity();
                    } else {
                        console.log(`WE HAVE STARTED`);
                        startOffCodeTimer();
                    }
                })
            );

            // Listen for text document changes.
            context.subscriptions.push(
                vscode.workspace.onDidChangeTextDocument(() => {
                    recordActivity();
                    currFile.lastRecordedTime = Date.now();
                    if (!currFile.startTime && vscode.window.state.focused) {
                        startTimer();
                    }
                })
            );

            // Listen for selection changes (e.g., moving the cursor).
            context.subscriptions.push(
                vscode.window.onDidChangeTextEditorSelection(() => {
                    recordActivity();
                    currFile.lastRecordedTime = Date.now();
                    if (!currFile.startTime && vscode.window.state.focused) {
                        startTimer();
                    }
                })
            );

            // Listen for visible range changes (e.g., scrolling).
            context.subscriptions.push(
                vscode.window.onDidChangeTextEditorVisibleRanges(() => {
                    recordActivity();
                    currFile.lastRecordedTime = Date.now();
                    if (!currFile.startTime && vscode.window.state.focused) {
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
                    currFile.numKeyPresses++;

                    // Forward the key event to the default type command so that text is still inserted
                    await vscode.commands.executeCommand('default:type', args);
                })
            );

            //count number of undos
            context.subscriptions.push(
                vscode.commands.registerCommand('undo', async () => {
                    currFile.undoCt++;
                    await vscode.commands.executeCommand('default:undo');
                })
            );

            context.subscriptions.push(
                vscode.commands.registerCommand('extension.trackPaste', async () => {
                    currFile.pasteCount++;
                    await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
                })
            );
            context.subscriptions.push(
                vscode.commands.registerCommand('extension.trackCopy', async () => {
                    currFile.copyCount++;
                    await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
                })
            );
            context.subscriptions.push(
                vscode.commands.registerCommand('extension.trackCut', async () => {
                    currFile.cutCount++;
                    await vscode.commands.executeCommand('editor.action.clipboardCutAction');
                })
            );



            //check for idle detection which triggers after a minute of no behavior
            const idleCheckInterval = setInterval(() => {
                if (currFile.startTime && (Date.now() - currFile.lastRecordedTime > idleThreshold)) {
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
            recordActivity();
            // stopTimer();
            vscode.window.showInformationMessage(`Active: ${formatTime(currFile.activeTime)}. \n
                                                                          Idle: ${formatTime(currFile.idleTime)}. \n
                                                                          Total: ${formatTime(currFile.activeTime + currFile.idleTime)}`);
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
            vscode.window.showInformationMessage(`Total time spent: ${formatTime(currFile.activeTime + currFile.idleTime)}. \n
                                                                                  Key presses: ${currFile.numKeyPresses}. \n
                                          Undos: ${currFile.undoCt}. \n Pastes: ${currFile.pasteCount}.\n
                                                                                  Thanks for using CodeClock!`);
            deactivate();
        } else {
            vscode.window.showInformationMessage(`There is no CodeClock timer running.`);
        }
    });
    context.subscriptions.push(endTimeCommand);
}

function deactivate() {

    exportAsCSV();
    timerInitialized = null;
    doOver = true;
    // currFile.keystrokeCt = 0;
    // currFile.undoCt = 0;
    // currFile.numKeyPresses = 0;

    // // idle and active time are in milliseconds
    // currFile.idleTime = 0;
    // currFile.activeTime = 0;
    // totalTime = 0;
    // doOver = true;
    // startTime = null;
}

module.exports = {
    activate,
    deactivate
};