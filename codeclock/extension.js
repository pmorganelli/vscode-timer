// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');

// Variables to track time
let startTime = null;
let totalTime = 0;
let lastActivityTime = Date.now();

// Idle threshold in milliseconds (currently 30 seconds for testing; adjust as needed)
const idleThreshold = 30000;

// Start the timer if not already started
function startTimer() {
  if (!startTime) {
    startTime = Date.now();
  }
}

// Stop the timer and add elapsed time to totalTime
function stopTimer() {
  if (startTime) {
    totalTime += Date.now() - startTime;
    startTime = null;
  }
}

// Format milliseconds into "X min Y sec"
function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} min ${secs} sec`;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Extension "codeclock" is now active!');

  // Listen for window focus changes.
  vscode.window.onDidChangeWindowState((state) => {
    if (state.focused) {
      startTimer();
      // Reset the last activity time when the window is focused
      lastActivityTime = Date.now();
    } else {
      stopTimer();
    }
  });

  // Listen for changes in text documents to detect user activity.
  vscode.workspace.onDidChangeTextDocument(() => {
    lastActivityTime = Date.now();
    // If the window is focused and the timer isn't running, restart it.
    if (!startTime && vscode.window.state.focused) {
      startTimer();
    }
  });

  // Check for idle time every 5 seconds.
  const idleCheckInterval = setInterval(() => {
    if (startTime && (Date.now() - lastActivityTime > idleThreshold)) {
      stopTimer();
      vscode.window.setStatusBarMessage("Idle: Timer paused", 3000);
    }
  }, 5000);
  context.subscriptions.push({ dispose: () => clearInterval(idleCheckInterval) });

  // Register a command to show the tracked time.
  let disposable = vscode.commands.registerCommand('extension.showTime', () => {
    // Optionally, update timer before showing total time.
    if (startTime) {
      stopTimer();
    }
    vscode.window.showInformationMessage(`Total active time: ${formatTime(totalTime)}`);
  });
  context.subscriptions.push(disposable);
}

/**
 * This method is called when your extension is deactivated.
 */
function deactivate() {
  stopTimer();
}

module.exports = {
  activate,
  deactivate
};
