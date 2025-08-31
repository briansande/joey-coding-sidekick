export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    svg: string;
    check: (stats: Record<string, number>) => boolean;
}

export const achievements: Achievement[] = [
    {
        id: 'code_10',
        name: 'Code Novice',
        description: 'Switch to Code mode 10 times.',
        unlocked: false,
        svg: 'media/achievements/code_10.svg',
        check: (stats) => (stats['code'] || 0) >= 10,
    },
    {
        id: 'architect_10',
        name: 'Architect Novice',
        description: 'Switch to Architect mode 10 times.',
        unlocked: false,
        svg: 'media/achievements/architect_10.svg',
        check: (stats) => (stats['architect'] || 0) >= 10,
    },
    {
        id: 'ask_10',
        name: 'Ask Novice',
        description: 'Switch to Ask mode 10 times.',
        unlocked: false,
        svg: 'media/achievements/ask_10.svg',
        check: (stats) => (stats['ask'] || 0) >= 10,
    },
    {
        id: 'debug_10',
        name: 'Debug Novice',
        description: 'Switch to Debug mode 10 times.',
        unlocked: false,
        svg: 'media/achievements/debug_10.svg',
        check: (stats) => (stats['debug'] || 0) >= 10,
    },
    {
        id: 'orchestrator_10',
        name: 'Orchestrator Novice',
        description: 'Switch to Orchestrator mode 10 times.',
        unlocked: false,
        svg: 'media/achievements/orchestrator_10.svg',
        check: (stats) => (stats['orchestrator'] || 0) >= 10,
    },
    {
        id: 'tokens_1',
        name: 'Token User',
        description: 'Use 1,000,000 tokens.',
        unlocked: false,
        svg: 'media/achievements/tokens_1.svg',
        check: (stats) => (stats['totalTokens'] || 0) >= 1000000,
    },
    {
        id: 'tokens_2',
        name: 'Token Enthusiast',
        description: 'Use 10,000,000 tokens.',
        unlocked: false,
        svg: 'media/achievements/tokens_2.svg',
        check: (stats) => (stats['totalTokens'] || 0) >= 10000000,
    },
    {
        id: 'tokens_3',
        name: 'Token Advocate',
        description: 'Use 100,000,000 tokens.',
        unlocked: false,
        svg: 'media/achievements/tokens_3.svg',
        check: (stats) => (stats['totalTokens'] || 0) >= 100000000,
    },
    {
        id: 'tokens_4',
        name: 'Token Visionary',
        description: 'Use 1,000,000,000 tokens.',
        unlocked: false,
        svg: 'media/achievements/tokens_4.svg',
        check: (stats) => (stats['totalTokens'] || 0) >= 1000000000,
    },
    {
        id: 'tokens_5',
        name: 'Token Billionaire',
        description: 'Use 10,000,000,000 tokens.',
        unlocked: false,
        svg: 'media/achievements/tokens_5.svg',
        check: (stats) => (stats['totalTokens'] || 0) >= 10000000000,
    },
    // Task-Based Achievements
    {
        id: 'task_1',
        name: 'Task Novice',
        description: 'Complete 1 task.',
        unlocked: false,
        svg: 'media/achievements/task_1.svg',
        check: (stats) => (stats['tasksCompleted'] || 0) >= 1,
    },
    {
        id: 'task_10',
        name: 'Task Pro',
        description: 'Complete 10 tasks.',
        unlocked: false,
        svg: 'media/achievements/task_10.svg',
        check: (stats) => (stats['tasksCompleted'] || 0) >= 10,
    },
    {
        id: 'task_100',
        name: 'Task Master',
        description: 'Complete 100 tasks.',
        unlocked: false,
        svg: 'media/achievements/task_100.svg',
        check: (stats) => (stats['tasksCompleted'] || 0) >= 100,
    },

    // Jump-Based Achievements
    {
        id: 'jump_10',
        name: 'Bunny Hopper',
        description: 'Jump 10 times.',
        unlocked: false,
        svg: 'media/achievements/jump_10.svg',
        check: (stats) => (stats['jumps'] || 0) >= 10,
    },
    {
        id: 'jump_100',
        name: 'Pogo Pro',
        description: 'Jump 100 times.',
        unlocked: false,
        svg: 'media/achievements/jump_100.svg',
        check: (stats) => (stats['jumps'] || 0) >= 100,
    },
    {
        id: 'jump_1000',
        name: 'Space Jumper',
        description: 'Jump 1000 times.',
        unlocked: false,
        svg: 'media/achievements/jump_1000.svg',
        check: (stats) => (stats['jumps'] || 0) >= 1000,
    },

    // Tool-Based Achievements
    {
        id: 'tool_dabbler',
        name: 'Tool Dabbler',
        description: 'Use 5 different tools.',
        unlocked: false,
        svg: 'media/achievements/tool_dabbler.svg',
        check: (stats) => Object.keys(stats).filter(k => k.startsWith('tool_')).length >= 5,
    },
    {
        id: 'tool_master',
        name: 'Tool Master',
        description: 'Use every available tool at least once.',
        unlocked: false,
        svg: 'media/achievements/tool_master.svg',
        check: (stats) => {
            const usedTools = Object.keys(stats).filter(k => k.startsWith('tool_')).map(k => k.replace('tool_', ''));
            const allTools = [
                'execute_command', 'read_file', 'write_to_file', 'apply_diff', 'insert_content',
                'search_and_replace', 'search_files', 'list_files', 'list_code_definition_names',
                'browser_action', 'use_mcp_tool', 'access_mcp_resource', 'ask_followup_question',
                'attempt_completion', 'switch_mode', 'new_task', 'fetch_instructions',
                'codebase_search', 'update_todo_list', 'generate_image'
            ];
            return allTools.every(tool => usedTools.includes(tool));
        },
    },
    {
        id: 'creator',
        name: 'The Creator',
        description: 'Use write_to_file to create a new file.',
        unlocked: false,
        svg: 'media/achievements/creator.svg',
        check: (stats) => (stats['tool_write_to_file'] || 0) >= 1,
    },
    {
        id: 'explorer',
        name: 'The Explorer',
        description: 'Use list_files or search_files.',
        unlocked: false,
        svg: 'media/achievements/explorer.svg',
        check: (stats) => (stats['tool_list_files'] || 0) >= 1 || (stats['tool_search_files'] || 0) >= 1,
    },
    {
        id: 'commander',
        name: 'The Commander',
        description: 'Use execute_command.',
        unlocked: false,
        svg: 'media/achievements/commander.svg',
        check: (stats) => (stats['tool_execute_command'] || 0) >= 1,
    },

    // Mode-Based Achievements
    {
        id: 'polyglot',
        name: 'Polyglot',
        description: 'Use all available modes.',
        unlocked: false,
        svg: 'media/achievements/polyglot.svg',
        check: (stats) => {
            const usedModes = Object.keys(stats).filter(k => !k.startsWith('tool_') && k !== 'totalTokens' && k !== 'tasksCompleted');
            const allModes = ['code', 'architect', 'ask', 'debug', 'orchestrator'];
            return allModes.every(mode => usedModes.includes(mode));
        }
    },
];