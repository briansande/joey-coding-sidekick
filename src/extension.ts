import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import { StatsManager } from './StatsManager';
import { initializeRooAPI, setupRooEventListeners } from './roocode/api';
import { registerCommands } from './commands';
import { AchievementManager } from './AchievementManager';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "joey-coding-sidekick" is now active!');

    const api = await initializeRooAPI();

    if (api) {
        const statsManager = new StatsManager(context);
        const achievementManager = new AchievementManager(context);
        const sidebarProvider = new SidebarProvider(context.extensionUri);
        setupRooEventListeners(api, sidebarProvider, statsManager, achievementManager);
        
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                "joey.sidebar",
                sidebarProvider
            )
        );

        registerCommands(context, statsManager, sidebarProvider);
    }
}

export function deactivate() {}