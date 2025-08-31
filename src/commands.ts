import * as vscode from 'vscode';
import { getRooApi } from './roocode/api';
import { StatsManager } from './StatsManager';
import { SidebarProvider } from './SidebarProvider';
import { AchievementManager } from './AchievementManager';

export function registerCommands(context: vscode.ExtensionContext, sidebarProvider: SidebarProvider) {
    const achievementManager = new AchievementManager(context);
    const statsManager = new StatsManager(context, sidebarProvider, achievementManager);
    const api = getRooApi();

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

    const clearStatsDisposable = vscode.commands.registerCommand('joey-sidekick.resetStats', () => {
        statsManager.clearStats();
        vscode.window.showInformationMessage('Joey\'s stats have been cleared.');
    });

    const showStatsDisposable = vscode.commands.registerCommand('joey.showStats', () => {
        const stats = statsManager.getStats();
        const achievements = achievementManager.getAchievements();
        sidebarProvider.postMessageToWebview({ type: 'toggleStats', value: { stats, achievements } });
        sidebarProvider.sendAchievements(achievements);
    });

    const clearAchievementsDisposable = vscode.commands.registerCommand('joey-sidekick.clearAchievements', () => {
        achievementManager.clearAchievements();
        const stats = statsManager.getStats();
        const achievements = achievementManager.getAchievements();
        sidebarProvider.postMessageToWebview({ type: 'toggleStats', value: { stats, achievements } });
        sidebarProvider.sendAchievements(achievements);
        vscode.window.showInformationMessage('All achievements have been cleared.');
    });

    const flipJoeyDisposable = vscode.commands.registerCommand('joey-sidekick.flipJoey', () => {
        const config = vscode.workspace.getConfiguration('joey-sidekick');
        const isFlipped = config.get('flipped', false);
        config.update('flipped', !isFlipped, vscode.ConfigurationTarget.Global);
        sidebarProvider.postMessageToWebview({ type: 'flipJoey', value: !isFlipped });
    });

    const toggleAchievementsDisposable = vscode.commands.registerCommand('joey-sidekick.toggleAchievements', () => {
        const config = vscode.workspace.getConfiguration('joey-sidekick');
        const showAchievements = config.get('showAchievements', true);
        config.update('showAchievements', !showAchievements, vscode.ConfigurationTarget.Global);
        sidebarProvider.postMessageToWebview({ type: 'setAchievementsVisibility', value: !showAchievements });
    });

    const incrementJumpCountDisposable = vscode.commands.registerCommand('incrementJumpCount', () => {
        statsManager.incrementJumpCount();
    });

    context.subscriptions.push(startTaskDisposable, clearStatsDisposable, showStatsDisposable, clearAchievementsDisposable, flipJoeyDisposable, toggleAchievementsDisposable, incrementJumpCountDisposable);
}