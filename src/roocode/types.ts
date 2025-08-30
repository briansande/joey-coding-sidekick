// Define the types for the Roocode API based on the source code
export enum RooCodeEventName {
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

export interface RooCodeSettings {} // Empty for now, as we don't need to configure it

export interface RooCodeAPI {
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