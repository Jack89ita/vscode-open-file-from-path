/* jshint esversion: 6 */

//Required modules
const vscode = require('vscode');
//const fs = require('fs');
const path = require('path');
const recursive = require("recursive-readdir");

//Get preferences
const preferences = vscode.workspace.getConfiguration('open-file-from-path');
const startingPath = preferences.get('startingPath');
const searchExclusion = preferences.get('searchExclusion');
const custRegExp = new RegExp(preferences.get('regExp'));
const matchFileName = preferences.get('matchFileName');

//Set error view
const showError = message => vscode.window.showErrorMessage(`Open file from path: ${message}`);

exports.activate = context => {
  //Register command
  const openFileFromPath = vscode.commands.registerCommand('extension.openFileFromPath', () => {

    //Check to see if workspace is open
    if (!vscode.workspace.rootPath) {
      return showError('You must have a workspace opened.');
    }

    let editor = vscode.window.activeTextEditor;
    //Get the selection starting from the cursor position and searching for a regular expression (default search between quotes or double quotes)
    let range = editor.document.getWordRangeAtPosition(editor.selection.active, custRegExp);

    //If range is empty throw error
    if (typeof range ==='undefined'){
      showError("Current cursor position is not valid, check the 'open-file-from-path.regExp' option to configure your RegExp match");
      return false;
    }

    var currentlyOpenTabfilePath = editor.document.fileName;
    //Get the pure match against the regualr expression
    let matchArray = editor.document.getText(range).match(custRegExp);
    
    //Loop to search for a defined match (skipping index 0 because regex will return an Array containing the entire matched string as the first element)
    let found = false;
    for (var i = 1; i < matchArray.length; i++) {
      if (typeof matchArray[i] !== 'undefined'){
        found = i;
        break;
      }
    }

    if (found==false){
      showError("No match found");
      return false;
    }

    //Get the last part to compare if "matchFileName" is true, otherwise search the entire path
    let lastPart = (matchFileName) ? matchArray[found].split('/').pop() : matchArray[found].trim();
    lastPart = lastPart.replace(/^.+\.\//, '');
    if(lastPart.indexOf('./') != -1) lastPart = lastPart.replace('./', '');

    let searchPath = folderPath => {
      //Get absolute path
      let folderFullPath = path.join(vscode.workspace.rootPath, folderPath);
      let foundList = [];

      //Recursive search into absolute path
      recursive(folderFullPath, searchExclusion, (readErr, files) => {

        for (var index in files) {
          //Convert backslashes to forward slashes
          let filePathConverted = files[index].replace(/\\/g, '/');

          //If matchFileName is true, check the last part of the path to match
          //If matchFileName is false, check the entire path to match
          if ((matchFileName && filePathConverted.split('/').pop() == lastPart) || (!matchFileName && filePathConverted.indexOf(lastPart)>0)){
            //Get only the relative path to show, otherwise it will be too long.
            let relativePath = files[index].replace(vscode.workspace.rootPath, '').replace(/\\/g, '/');
            foundList.push({
              label: lastPart,
              description: relativePath,
              path: filePathConverted
            });
          }
        }

        if (foundList.length == 0) {
          //If no matches -> throw error
          showError("Warning, no matches were found.");
        } else if (foundList.length == 1) {
          //If 1 match -> open file
          //Check for a starting slash to remove
          let file = foundList[0].path;
          if (file.charAt(0) === '/') file = file.substr(1);
          let url = vscode.Uri.parse('file:///' + file);
          vscode.commands.executeCommand('vscode.open', url);
        } else {
          //If multiple matches -> open quick pick
          vscode.window.showQuickPick(foundList).then(selected => {
            if (typeof selected !== 'undefined' && selected) {
              //Check for a starting slash to remove
              let file = selected.path;
              if (file.charAt(0) === '/') file = file.substr(1);
              //If selection is valid open file
              let url = vscode.Uri.parse('file:///' + file);
              vscode.commands.executeCommand('vscode.open', url);
            }
          });
        }

      });
    };

    const startingPathes = startingPath.split(",");
    for (var index in startingPathes) {
      if (currentlyOpenTabfilePath.startsWith(path.join(vscode.workspace.rootPath, startingPathes[index]))) {
        //Init everything
        searchPath(startingPathes[index]);
        break;
      }
    }
  });

  context.subscriptions.push(openFileFromPath);
};

exports.deactivate = () => { };