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
        const achievementManager = new AchievementManager(context);
        const sidebarProvider = new SidebarProvider(context.extensionUri, achievementManager);
        const statsManager = new StatsManager(context, sidebarProvider, achievementManager);
        setupRooEventListeners(api, sidebarProvider, statsManager, achievementManager);
        
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                "joey.sidebar",
                sidebarProvider
            )
        );

        registerCommands(context, sidebarProvider);
        
        let inactivityTimeout: NodeJS.Timeout;
        let boredInterval: NodeJS.Timeout | undefined;
        const boredIntervalTime = 10000; // 10 seconds

        function startBoredInterval() {
            if (!boredInterval) {
                boredInterval = setInterval(() => {
                    sidebarProvider.postMessageToWebview({ type: 'joeyIsBored', value: null });
                }, boredIntervalTime);
            }
        }

        function resetInactivityTimer() {
            clearTimeout(inactivityTimeout);
            if (boredInterval) {
                clearInterval(boredInterval);
                boredInterval = undefined;
            }
            inactivityTimeout = setTimeout(() => {
                sidebarProvider.postMessageToWebview({ type: 'joeyIsBored', value: null });
                startBoredInterval();
            }, boredIntervalTime);
        }

        vscode.workspace.onDidChangeTextDocument(() => resetInactivityTimer());
        vscode.window.onDidChangeActiveTextEditor(() => resetInactivityTimer());

        resetInactivityTimer();
    }
}

export function deactivate() {}