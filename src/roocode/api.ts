import * as vscode from 'vscode';
import { RooCodeAPI, RooCodeEventName, TokenUsage, ToolUsage } from './types';
import { SidebarProvider } from '../SidebarProvider';
import { StatsManager } from '../StatsManager';
import { AchievementManager } from '../AchievementManager';

let rooApi: RooCodeAPI | undefined;

export async function initializeRooAPI(): Promise<RooCodeAPI | undefined> {
    const rooExtension = vscode.extensions.getExtension<RooCodeAPI>('RooVeterinaryInc.roo-cline');
    if (!rooExtension) {
        vscode.window.showErrorMessage('Roocode extension not found. Please install it to use Joey.');
        return undefined;
    }

    try {
        console.log('Waiting for Roocode extension to activate...');
        rooApi = await rooExtension.activate();
        console.log('Roocode extension activated and API retrieved.');

        if (!rooApi) {
            vscode.window.showErrorMessage('Could not get Roocode API.');
            return undefined;
        }
        
        vscode.window.showInformationMessage('Joey is connected to Roocode!');
        return rooApi;
    } catch (error) {
        console.error('Failed to activate Roocode extension or get API:', error);
        vscode.window.showErrorMessage(`Failed to connect to Roocode. Error: ${error}`);
        return undefined;
    }
}

export function setupRooEventListeners(api: RooCodeAPI, sidebarProvider: SidebarProvider, statsManager: StatsManager, achievementManager: AchievementManager) {
    sidebarProvider.postMessageToWebview({ type: 'updateStats', value: statsManager.getStats() });
    sidebarProvider.postMessageToWebview({ type: 'updateAchievements', value: achievementManager.getAchievements() });

    // Listen for all events from Roocode
    Object.values(RooCodeEventName)
        .filter(e => ![
            RooCodeEventName.TaskModeSwitched,
            RooCodeEventName.TaskCompleted
        ].includes(e))
        .forEach(eventName => {
            api.on(eventName, (data: any) => {
                console.log(`Received Roocode event: ${eventName}`, data);
                sidebarProvider.postMessageToWebview({ type: eventName, value: data });
            });
    });

    // Handle taskModeSwitched separately as it has a different signature
    api.on(RooCodeEventName.TaskModeSwitched, (taskId: string, modeSlug: string) => {
        console.log(`Received Roocode event: ${RooCodeEventName.TaskModeSwitched}`, { taskId, modeSlug });
        const updatedStats = statsManager.incrementModeCount(modeSlug);
        sidebarProvider.postMessageToWebview({
            type: RooCodeEventName.TaskModeSwitched,
            value: { taskId, modeSlug }
        });
        sidebarProvider.postMessageToWebview({ type: 'updateStats', value: updatedStats });

        const newlyUnlocked = achievementManager.checkAchievements(updatedStats);
        if (newlyUnlocked.length > 0) {
            sidebarProvider.postMessageToWebview({ type: 'achievementsUnlocked', value: newlyUnlocked });
            sidebarProvider.postMessageToWebview({ type: 'updateAchievements', value: achievementManager.getAchievements() });
        }
    });

    // Handle taskCompleted separately to include token and tool usage
    api.on(RooCodeEventName.TaskCompleted, (taskId: string, tokenUsage: TokenUsage, toolUsage: ToolUsage) => {
        console.log(`Received Roocode event: ${RooCodeEventName.TaskCompleted}`, { taskId, tokenUsage, toolUsage });
    
        // Add tokens to stats
        const totalTokens = (tokenUsage.totalTokensIn || 0) + (tokenUsage.totalTokensOut || 0);
        let updatedStats = statsManager.addTokens(totalTokens);
    
        // Increment tasks completed
        updatedStats = statsManager.incrementTaskCount();
    
        // Add tool usage to stats
        for (const toolName in toolUsage) {
            if (toolUsage.hasOwnProperty(toolName)) {
                updatedStats = statsManager.addToolUsage(toolName);
            }
        }
    
        sidebarProvider.postMessageToWebview({
            type: RooCodeEventName.TaskCompleted,
            value: { taskId, tokenUsage, toolUsage }
        });
        sidebarProvider.postMessageToWebview({ type: 'updateStats', value: updatedStats });
    
        const newlyUnlocked = achievementManager.checkAchievements(updatedStats);
        if (newlyUnlocked.length > 0) {
            sidebarProvider.postMessageToWebview({ type: 'achievementsUnlocked', value: newlyUnlocked });
            sidebarProvider.postMessageToWebview({ type: 'updateAchievements', value: achievementManager.getAchievements() });
        }
    });
}

export function getRooApi(): RooCodeAPI | undefined {
    return rooApi;
}