import * as vscode from 'vscode';
import { getRooApi } from './roocode/api';

export class SidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'joey.sidebar';

    private _view?: vscode.WebviewView;
    private _currentMode: string = 'code'; // Default to 'code'

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    public postMessageToWebview(message: { type: string, value: any }) {
        if (this._view) {
            this._view.webview.postMessage(message);
        }
    }

    public setCurrentMode(mode: string) {
        this._currentMode = mode;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

        // Do the same for the stylesheet.
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        const charSpriteUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'char-sprite-sheet.png'));

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();
        const currentMode = this._currentMode;

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				
				<title>Joey</title>
                <style>
                    :root {
                        --char-sprite-sheet: url(${charSpriteUri});
                    }
                </style>
			</head>
			<body>
                <div id="message-container-wrapper">
                    <div id="chat-container"></div>
                </div>
                <div id="stats-container"></div>
                <div id="achievements-container"></div>
                <div id="pet-container">
                    <div id="character" class="idle"></div>
                </div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}