const vscode = require('vscode');
const path = require('path');

const NDJL_KEYWORDS = [
    { label: 'create', kind: vscode.CompletionItemKind.Keyword, detail: 'Declare a variable', insertText: 'create ' },
    { label: 'number', kind: vscode.CompletionItemKind.Keyword, detail: 'Number type', insertText: 'number ' },
    { label: 'text', kind: vscode.CompletionItemKind.Keyword, detail: 'Text type', insertText: 'text ' },
    { label: 'list', kind: vscode.CompletionItemKind.Keyword, detail: 'List type', insertText: 'list ' },
    { label: 'say', kind: vscode.CompletionItemKind.Keyword, detail: 'Print output', insertText: 'say ' },
    { label: 'if', kind: vscode.CompletionItemKind.Keyword, detail: 'Conditional block', insertText: 'if ' },
    { label: 'else', kind: vscode.CompletionItemKind.Keyword, detail: 'Else branch', insertText: 'else' },
    { label: 'end', kind: vscode.CompletionItemKind.Keyword, detail: 'End block', insertText: 'end' },
    { label: 'repeat', kind: vscode.CompletionItemKind.Keyword, detail: 'Loop construct', insertText: 'repeat ' },
    { label: 'times', kind: vscode.CompletionItemKind.Keyword, detail: 'Loop times', insertText: 'times' },
    { label: 'define', kind: vscode.CompletionItemKind.Keyword, detail: 'Define a function', insertText: 'define ' },
    { label: 'return', kind: vscode.CompletionItemKind.Keyword, detail: 'Return value', insertText: 'return ' },
    { label: 'ask', kind: vscode.CompletionItemKind.Keyword, detail: 'Get user input', insertText: 'ask ' },
    { label: 'into', kind: vscode.CompletionItemKind.Keyword, detail: 'Store into variable', insertText: 'into ' },
    { label: 'and', kind: vscode.CompletionItemKind.Keyword, detail: 'Logical AND', insertText: 'and ' },
    { label: 'or', kind: vscode.CompletionItemKind.Keyword, detail: 'Logical OR', insertText: 'or ' },
    { label: 'not', kind: vscode.CompletionItemKind.Keyword, detail: 'Logical NOT', insertText: 'not ' },
    { label: 'plus', kind: vscode.CompletionItemKind.Operator, detail: 'Addition operator', insertText: 'plus ' },
    { label: 'minus', kind: vscode.CompletionItemKind.Operator, detail: 'Subtraction operator', insertText: 'minus ' },
    { label: 'greater than', kind: vscode.CompletionItemKind.Operator, detail: 'Greater than comparison', insertText: 'greater than ' },
    { label: 'less than', kind: vscode.CompletionItemKind.Operator, detail: 'Less than comparison', insertText: 'less than ' },
    { label: 'equals', kind: vscode.CompletionItemKind.Operator, detail: 'Equality comparison', insertText: 'equals ' }
];

function getRunCommand(filePath) {
    const config = vscode.workspace.getConfiguration('ndjl');
    const interpreterPath = config.get('interpreterPath', '');

    if (interpreterPath) {
        // User configured a custom path to the NDJL index.js
        return `node "${interpreterPath}" "${filePath}"`;
    }

    // Try to find the NDJL project in the workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        for (const folder of workspaceFolders) {
            const ndjlIndex = path.join(folder.uri.fsPath, 'NDJL', 'index.js');
            try {
                require('fs').accessSync(ndjlIndex);
                return `node "${ndjlIndex}" "${filePath}"`;
            } catch {}
        }
    }

    // Fallback to global CLI
    return `ndjl run "${filePath}"`;
}

function activate(context) {
    // Register the Run NDJL File command
    const runCommand = vscode.commands.registerCommand('ndjl.runFile', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active NDJL file to run.');
            return;
        }

        const filePath = editor.document.fileName;
        if (!filePath.endsWith('.ndjl')) {
            vscode.window.showErrorMessage('The active file is not a .ndjl file.');
            return;
        }

        // Save the file before running
        editor.document.save().then(() => {
            const cmd = getRunCommand(filePath);
            const terminal = vscode.window.createTerminal('NDJL');
            terminal.show();
            terminal.sendText(cmd);
        });
    });

    // Register completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider('ndjl', {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substring(0, position.character).trimStart();

            const items = NDJL_KEYWORDS.map(kw => {
                const item = new vscode.CompletionItem(kw.label, kw.kind);
                item.detail = kw.detail;
                item.insertText = kw.insertText;
                return item;
            });

            // Short trigger completions
            const shortcuts = [
                { trigger: 'cr', label: 'create', text: 'create ', detail: 'Declare a variable' },
                { trigger: 'sa', label: 'say', text: 'say ', detail: 'Print output' },
                { trigger: 're', label: 'repeat', text: 'repeat ', detail: 'Loop construct' },
                { trigger: 'de', label: 'define', text: 'define ', detail: 'Define a function' },
                { trigger: 'nu', label: 'number', text: 'number ', detail: 'Number type' },
                { trigger: 'te', label: 'text', text: 'text ', detail: 'Text type' },
                { trigger: 'li', label: 'list', text: 'list ', detail: 'List type' },
                { trigger: 're', label: 'return', text: 'return ', detail: 'Return value' },
                { trigger: 'as', label: 'ask', text: 'ask ', detail: 'Get user input' }
            ];

            for (const sc of shortcuts) {
                if (linePrefix.endsWith(sc.trigger) || linePrefix === sc.trigger) {
                    const item = new vscode.CompletionItem(sc.label, vscode.CompletionItemKind.Keyword);
                    item.detail = sc.detail;
                    item.insertText = sc.text;
                    item.preselect = true;
                    item.sortText = '0' + sc.label;
                    items.push(item);
                }
            }

            return items;
        }
    });

    context.subscriptions.push(runCommand, completionProvider);
}

function deactivate() {}

module.exports = { activate, deactivate };
