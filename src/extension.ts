import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

// Define the types for the Roocode API based on the source code
enum RooCodeEventName {
    Message = "message",
    TaskCreated = "taskCreated",
    TaskStarted = "taskStarted",
    TaskCompleted = "taskCompleted",
    TaskAborted = "taskAborted",
    TaskPaused = "taskPaused",
    TaskUnpaused = "taskUnpaused",
    TaskSpawned = "taskSpawned",
    TaskModeSwitched = "taskModeSwitched",
    TaskToolFailed = "taskToolFailed",
    TaskTokenUsageUpdated = "taskTokenUsageUpdated",
}

interface RooCodeSettings {} // Empty for now, as we don't need to configure it

interface RooCodeAPI {
    startNewTask(options: {
        configuration: RooCodeSettings;
        text?: string;
        images?: string[];
        newTab?: boolean;
    }): Promise<string>; // Assuming it returns a task ID
    sendMessage(message: string): Promise<void>;
    pressPrimaryButton(): Promise<void>;
    pressSecondaryButton(): Promise<void>;
    on(event: string, listener: (...args: any[]) => void): this;
}

let rooApi: RooCodeAPI | undefined;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "joey-coding-sidekick" is now active!');

    const rooExtension = vscode.extensions.getExtension<RooCodeAPI>('RooVeterinaryInc.roo-cline');
    if (!rooExtension) {
        vscode.window.showErrorMessage('Roocode extension not found. Please install it to use Joey.');
        return;
    }

    try {
        console.log('Waiting for Roocode extension to activate...');
        rooApi = await rooExtension.activate();
        console.log('Roocode extension activated and API retrieved.');

        if (!rooApi) {
            vscode.window.showErrorMessage('Could not get Roocode API.');
            return;
        }

        const api = rooApi;
        vscode.window.showInformationMessage('Joey is connected to Roocode!');

        const sidebarProvider = new SidebarProvider(context.extensionUri);

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

        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                "joey.sidebar",
                sidebarProvider
            )
        );
        context.subscriptions.push(disposable);

    } catch (error) {
        console.error('Failed to activate Roocode extension or get API:', error);
        vscode.window.showErrorMessage(`Failed to connect to Roocode. Error: ${error}`);
    }
}

export function deactivate() {}