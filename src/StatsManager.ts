import * as vscode from 'vscode';

export class StatsManager {
    private static readonly STATS_KEY = 'joey.modeUsageStats';

    constructor(private context: vscode.ExtensionContext) {
        this.migrateLegacyStats();
    }

    private migrateLegacyStats() {
        const legacyStats = this.context.globalState.get<Record<string, number>>('modeUsageStats');
        if (legacyStats) {
            this.context.globalState.update(StatsManager.STATS_KEY, legacyStats);
            this.context.globalState.update('modeUsageStats', undefined);
        }
    }

    public getStats(): Record<string, number> {
        return this.context.globalState.get<Record<string, number>>(StatsManager.STATS_KEY, {});
    }

    public incrementModeCount(modeSlug: string): Record<string, number> {
        const stats = this.getStats();
        stats[modeSlug] = (stats[modeSlug] || 0) + 1;
        this.context.globalState.update(StatsManager.STATS_KEY, stats);
        return stats;
    }
    public addTokens(count: number): Record<string, number> {
        const stats = this.getStats();
        stats['totalTokens'] = (stats['totalTokens'] || 0) + count;
        this.context.globalState.update(StatsManager.STATS_KEY, stats);
        return stats;
    }
    public incrementTaskCount(): Record<string, number> {
        const stats = this.getStats();
        stats['tasksCompleted'] = (stats['tasksCompleted'] || 0) + 1;
        this.context.globalState.update(StatsManager.STATS_KEY, stats);
        return stats;
    }

    public addToolUsage(toolName: string): Record<string, number> {
        const stats = this.getStats();
        const toolStatsKey = `tool_${toolName}`;
        stats[toolStatsKey] = (stats[toolStatsKey] || 0) + 1;
        this.context.globalState.update(StatsManager.STATS_KEY, stats);
        return stats;
    }


    public clearStats() {
        this.context.globalState.update(StatsManager.STATS_KEY, {});
    }
}