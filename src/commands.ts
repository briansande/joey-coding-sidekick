import * as vscode from 'vscode';
import { getRooApi } from './roocode/api';
import { StatsManager } from './StatsManager';
import { SidebarProvider } from './SidebarProvider';
import { AchievementManager } from './AchievementManager';

export function registerCommands(context: vscode.ExtensionContext, statsManager: StatsManager, sidebarProvider: SidebarProvider) {
    const api = getRooApi();
    const achievementManager = new AchievementManager(context);

    const startTaskDisposable = vscode.commands.registerCommand('joey-coding-sidekick.startTask', async () => {
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

    const clearStatsDisposable = vscode.commands.registerCommand('joey.clearStats', () => {
        statsManager.clearStats();
        vscode.window.showInformationMessage('Joey\'s stats have been cleared.');
    });

    const showStatsDisposable = vscode.commands.registerCommand('joey.showStats', () => {
        const stats = statsManager.getStats();
        const achievements = achievementManager.getAchievements();
        sidebarProvider.postMessageToWebview({ type: 'toggleStats', value: { stats, achievements } });
    });

    context.subscriptions.push(startTaskDisposable, clearStatsDisposable, showStatsDisposable);
}