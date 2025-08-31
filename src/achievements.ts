export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    check: (stats: Record<string, number>) => boolean;
}

export const achievements: Achievement[] = [
    {
        id: 'code_10',
        name: 'Code Novice',
        description: 'Switch to Code mode 10 times.',
        unlocked: false,
        check: (stats) => (stats['code'] || 0) >= 10,
    },
    {
        id: 'architect_10',
        name: 'Architect Novice',
        description: 'Switch to Architect mode 10 times.',
        unlocked: false,
        check: (stats) => (stats['architect'] || 0) >= 10,
    },
    {
        id: 'ask_10',
        name: 'Ask Novice',
        description: 'Switch to Ask mode 10 times.',
        unlocked: false,
        check: (stats) => (stats['ask'] || 0) >= 10,
    },
    {
        id: 'debug_10',
        name: 'Debug Novice',
        description: 'Switch to Debug mode 10 times.',
        unlocked: false,
        check: (stats) => (stats['debug'] || 0) >= 10,
    },
    {
        id: 'orchestrator_10',
        name: 'Orchestrator Novice',
        description: 'Switch to Orchestrator mode 10 times.',
        unlocked: false,
        check: (stats) => (stats['orchestrator'] || 0) >= 10,
    },
];