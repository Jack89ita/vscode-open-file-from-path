# Open file from path
 
![Open file from path](https://github.com/Jack89ita/vscode-open-file-from-path/master/img/offp-use-gif.gif)

Simple plugin for VS Code that allows you to quickly open file starting from path string. E.g. 
```
include("./myfolder/myfile.ext");
```
 
By default VS Code won't open relative/absolute path in PHP or other files with the classic `ctrl+click` command. This extension allows you to do it by searching throughout the project: just point your cursor on a path and press the `alt+d` default shortcut to open it.

## Shortcut
```
Open file : alt+d
```

## Features
 
* Navigate the project folder searching for files that matches selected path string.

## Extension Settings
 
* `open-file-from-path.startingPath`: Set the starting path for the file search, useful if you want to search only in a specific folder (default to `/`)
* `open-file-from-path.searchExclusion`: File or folder list to exclude (default `**/node_modules/**` and `**/.vscode/**`), glob formatted
* `open-file-from-path.regExp`: RegExp used to delimiter the path of the file to open (default `['|\"]([^'|\"]+)['|\"]`, by default get the file name between quotes or double quotes)
* `open-file-from-path.matchPureFilename`: Choose to search and match the pure filename or the entire path (default false)

## Change Log
See Change Log [here](CHANGELOG.md)

## Issues
Submit the [issues](https://github.com/Jack89ita/vscode-open-file-from-path/issues) if you find any bug or have any suggestion.

## Contribution
Fork the [repo](https://github.com/Jack89ita/vscode-open-file-from-path/) and submit pull requests.