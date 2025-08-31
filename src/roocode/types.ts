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
    TaskFocused = "taskFocused",
    TaskUnfocused = "taskUnfocused",
    TaskActive = "taskActive",
    TaskInteractive = "taskInteractive",
    TaskResumable = "taskResumable",
    TaskIdle = "taskIdle",
    TaskAskResponded = "taskAskResponded"
}

export type ToolName =
    | 'execute_command'
    | 'read_file'
    | 'write_to_file'
    | 'apply_diff'
    | 'insert_content'
    | 'search_and_replace'
    | 'search_files'
    | 'list_files'
    | 'list_code_definition_names'
    | 'browser_action'
    | 'use_mcp_tool'
    | 'access_mcp_resource'
    | 'ask_followup_question'
    | 'attempt_completion'
    | 'switch_mode'
    | 'new_task'
    | 'fetch_instructions'
    | 'codebase_search'
    | 'update_todo_list'
    | 'generate_image';


export interface TokenUsage {
    totalTokensIn: number;
    totalTokensOut: number;
    totalCacheWrites?: number;
    totalCacheReads?: number;
    totalCost: number;
    contextTokens: number;
}

export type ToolUsage = Record<string, {
    attempts: number;
    failures: number;
}>;

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