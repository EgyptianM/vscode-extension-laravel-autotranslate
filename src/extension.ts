"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs_1 = require("fs");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "laravel-autotranslate" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let transateTextCommand = vscode.commands.registerCommand('laravel-autotranslate.translateBladeText', () => {
        const editor = vscode.window.activeTextEditor;
        let selection = editor === null || editor === void 0 ? void 0 : editor.selection;
        let selectedText = editor === null || editor === void 0 ? void 0 : editor.document.getText(selection);
        if (selectedText != '') {
            selectedText = replaceApostrophe(selectedText);
            selectedText = removeNewLines(selectedText);
            replaceText(`__('${selectedText}')`);
            addToLanguageFile(selectedText);
        }
    });
    let translatePHPCodeCommand = vscode.commands.registerCommand('laravel-autotranslate.translatePHPCode', () => {
        const editor = vscode.window.activeTextEditor;
        let selection = editor === null || editor === void 0 ? void 0 : editor.selection;
        let selectedText = editor === null || editor === void 0 ? void 0 : editor.document.getText(selection);
        if (selectedText !== '') {
            // remove first and last '
            selectedText = selectedText.replace(/^'|'$/g, '');
            // remove first and last "
            selectedText = selectedText.replace(/^"|"$/g, '');
            selectedText = removeNewLines(selectedText);
            replaceText(`__('messages.${selectedText}')`);
            addToLanguageFile(selectedText);
        }
    });
    context.subscriptions.push(transateTextCommand);
    context.subscriptions.push(translatePHPCodeCommand);
}
exports.activate = activate;
function replaceApostrophe(selectedText) {
    return selectedText.replace(/'/g, '\\\'');
}
function removeNewLines(selectedText) {
    return selectedText.replace(/\n|\r/g, "");
}
function replaceText(replacedText) {
    const editor = vscode.window.activeTextEditor;
    editor === null || editor === void 0 ? void 0 : editor.edit(builder => {
        builder.replace(editor.selection, replacedText);
        editor.document.save();
    });
}
function addToLanguageFile(selectedText) {
    const editor = vscode.window.activeTextEditor;
    let projectFolder = vscode.workspace.getWorkspaceFolder(editor === null || editor === void 0 ? void 0 : editor.document.uri);
    var resourcesPath = (projectFolder === null || projectFolder === void 0 ? void 0 : projectFolder.uri.fsPath) + "\\resources\\lang\\";
    var resourceFilePath = resourcesPath + 'en.json';
    if (fs_1.existsSync(resourceFilePath)) {
        var resourceContent = fs_1.readFileSync(resourceFilePath, 'utf8');
        // check duplicates
        if (!resourceContent.includes(`"${selectedText}"`)) {
            var endOfArray = resourceContent.indexOf('}');
            var newContent = resourceContent.slice(0, endOfArray - 2); // assuming there is a carriage return before the ]
            newContent += `\",\r\n\t"${selectedText}" : "${selectedText}"\r\n}`;
            fs_1.writeFileSync(resourceFilePath, newContent);
        }
    }
    else
        vscode.window.showErrorMessage(`Laravel lang file ${resourceFilePath} not exists on disk`);
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
