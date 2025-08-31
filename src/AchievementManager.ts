import * as vscode from 'vscode';
import { Achievement, achievements } from './achievements';

export class AchievementManager {
    private static readonly UNLOCKED_ACHIEVEMENTS_KEY = 'joey.unlockedAchievements';
    private achievements: Achievement[] = achievements;

    constructor(private context: vscode.ExtensionContext) {
        this.loadUnlockedAchievements();
    }

    private loadUnlockedAchievements() {
        const unlockedIds = this.context.globalState.get<string[]>(AchievementManager.UNLOCKED_ACHIEVEMENTS_KEY, []);
        this.achievements.forEach(ach => {
            if (unlockedIds.includes(ach.id)) {
                ach.unlocked = true;
            }
        });
    }

    public getAchievements(): Achievement[] {
        return this.achievements;
    }

    public checkAchievements(stats: Record<string, number>): Achievement[] {
        const newlyUnlocked: Achievement[] = [];
        this.achievements.forEach(ach => {
            if (!ach.unlocked && ach.check(stats)) {
                ach.unlocked = true;
                newlyUnlocked.push(ach);
            }
        });

        if (newlyUnlocked.length > 0) {
            this.saveUnlockedAchievements();
        }

        return newlyUnlocked;
    }

    private saveUnlockedAchievements() {
        const unlockedIds = this.achievements.filter(ach => ach.unlocked).map(ach => ach.id);
        this.context.globalState.update(AchievementManager.UNLOCKED_ACHIEVEMENTS_KEY, unlockedIds);
    }
}