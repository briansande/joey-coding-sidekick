import * as vscode from 'vscode';
import { RooCodeAPI, RooCodeEventName } from './types';
import { SidebarProvider } from '../SidebarProvider';

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

export function setupRooEventListeners(api: RooCodeAPI, sidebarProvider: SidebarProvider) {
    // Listen for all events from Roocode
    Object.values(RooCodeEventName)
        .filter(e => e !== RooCodeEventName.TaskModeSwitched)
        .forEach(eventName => {
            api.on(eventName, (data: any) => {
                console.log(`Received Roocode event: ${eventName}`, data);
                sidebarProvider.postMessageToWebview({ type: eventName, value: data });
            });
    });

    // Handle taskModeSwitched separately as it has a different signature
    api.on(RooCodeEventName.TaskModeSwitched, (taskId: string, modeSlug: string) => {
        console.log(`Received Roocode event: ${RooCodeEventName.TaskModeSwitched}`, { taskId, modeSlug });
        sidebarProvider.postMessageToWebview({
            type: RooCodeEventName.TaskModeSwitched,
            value: { taskId, modeSlug }
        });
    });
}

export function getRooApi(): RooCodeAPI | undefined {
    return rooApi;
}