import * as vscode from 'vscode';
import { getRooApi } from './roocode/api';

export function registerCommands(context: vscode.ExtensionContext) {
    const api = getRooApi();

    const disposable = vscode.commands.registerCommand('joey-coding-sidekick.startTask', async () => {
        if (api) {
            const message = await vscode.window.showInputBox({ prompt: 'Enter a message to start a new Roocode task' });
            if (message) {
                try {
                    const taskId = await api.startNewTask({
                        configuration: {}, // Provide an empty configuration object
                        text: message,
                    });
                    vscode.window.showInformationMessage(`Started Roocode task ${taskId} with message: "${message}"`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    vscode.window.showErrorMessage(`Failed to start Roocode task: ${errorMessage}`);
                    console.error('Error starting Roocode task:', error);
                }
            }
        } else {
            vscode.window.showErrorMessage('Roocode API not available.');
        }
    });

    context.subscriptions.push(disposable);
}