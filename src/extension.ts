import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import { initializeRooAPI, setupRooEventListeners } from './roocode/api';
import { registerCommands } from './commands';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "joey-coding-sidekick" is now active!');

    const api = await initializeRooAPI();

    if (api) {
        const sidebarProvider = new SidebarProvider(context.extensionUri);
        setupRooEventListeners(api, sidebarProvider);
        
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                "joey.sidebar",
                sidebarProvider
            )
        );

        registerCommands(context);
    }
}

export function deactivate() {}