// @ts-check

(function () {
    /**
     * @typedef {{
     *  postMessage: (message: any) => void
     * }} VSCodeAPI
     */

    // @ts-ignore
    const vscode = acquireVsCodeApi();

    const chatContainer = document.getElementById('chat-container');
    const petContainer = document.getElementById('pet-container');
    const character = document.getElementById('character');
    const statsContainer = document.getElementById('stats-container');
    const achievementsContainer = document.getElementById('achievements-container');
    const statsAndAchievementsContainer = document.getElementById('stats-and-achievements-container');
    const debugWindowButton = document.getElementById('debug-window-button');
    const messageContainerWrapper = document.getElementById('message-container-wrapper');

    if (debugWindowButton && messageContainerWrapper) {
        debugWindowButton.addEventListener('click', () => {
            const isVisible = messageContainerWrapper.style.display === 'block';
            messageContainerWrapper.style.display = isVisible ? 'none' : 'block';
        });
    }

    const toolCategories = {
        write: ['editedExistingFile', 'newFileCreated', 'appliedDiff', 'searchAndReplace', 'insertContent'],
        read: ['codebaseSearch', 'readFile', 'fetchInstructions', 'listFilesTopLevel', 'listFilesRecursive', 'listCodeDefinitionNames', 'searchFiles', 'switchMode'],
        execute: ['execute_command']
    };
    const animation_frame_rate = {
        default: 200,
        code: 100
    };
    const min_animation_duration = 5000; // milliseconds

    const actionAnimations = {
        code: ['action-code-1', 'action-code-2'],
        orchestrator: ['action-orchestrator-1', 'action-orchestrator-2'],
        architect: ['action-architect-1', 'action-architect-2', 'action-architect-3', 'action-architect-2'],
        ask: ['action-ask-1', 'action-ask-2'],
        debug: ['action-debug-1', 'action-debug-2']
    };

    function getToolCategory(toolName) {
        for (const category in toolCategories) {
            if (toolCategories[category].includes(toolName)) {
                return category;
            }
        }
        return null;
    }

    let isJumping = false;
    let isActing = false;
    let thinkingInterval;
    let animationStartTime;
    let isProtectedAction = false;

    function playJumpAnimation() {
        if (!character || isJumping || isActing) return;
        isJumping = true;
        character.style.animation = 'none';
        // @ts-ignore
        void character.offsetHeight;
        character.className = 'jump-1';
        setTimeout(() => {
            if (!character) { isJumping = false; return; }
            character.className = 'jump-2';
            setTimeout(() => {
                if (!character) { isJumping = false; return; }
                character.className = 'jump-3';
                setTimeout(() => {
                    if (!character) { isJumping = false; return; }
                    character.className = 'idle';
                    character.style.animation = '';
                    isJumping = false;
                }, 300);
            }, 500);
        }, 600);
    }

    function playActionAnimation(animationMode) {
        if (!character || isActing || isJumping) return;
        const mode = animationMode || character.getAttribute('data-mode');
        if (!mode || !actionAnimations[mode]) return;
        isActing = true;
        if (mode === 'code') {
            isProtectedAction = true;
        }
        const frames = actionAnimations[mode];
        let currentFrame = 0;
        const frameRate = animation_frame_rate[mode] || animation_frame_rate.default;
        
        let animationInterval = setInterval(() => {
            if (character) character.className = frames[currentFrame];
            currentFrame = (currentFrame + 1) % frames.length;
        }, frameRate);

        setTimeout(() => {
            clearInterval(animationInterval);
            if (character) character.className = 'idle';
            isActing = false;
            isProtectedAction = false;
        }, min_animation_duration);
    }

    function startThinkingAnimation() {
        if (!character) return;
        const mode = character.getAttribute('data-mode');
        const thinkingModes = ['architect', 'orchestrator', 'debug'];
        if (!mode || !thinkingModes.includes(mode) || isActing) return;

        isActing = true;
        animationStartTime = Date.now();
        const frames = actionAnimations[mode];
        let currentFrame = 0;
        const frameRate = animation_frame_rate[mode] || animation_frame_rate.default;

        thinkingInterval = setInterval(() => {
            if (!character) {
                stopThinkingAnimation();
                return;
            }
            character.className = frames[currentFrame];
            currentFrame = (currentFrame + 1) % frames.length;
        }, frameRate);
    }

    function stopThinkingAnimation() {
        if (isProtectedAction) return;
        const elapsedTime = Date.now() - animationStartTime;
        const remainingTime = min_animation_duration - elapsedTime;

        const cleanup = () => {
            if (thinkingInterval) {
                clearInterval(thinkingInterval);
                thinkingInterval = null;
            }
            if (isActing) {
                // logApiState('API request stopped');
            }
            isActing = false;
            if (character) {
                character.className = 'idle';
            }
        };

        if(isActing){
            if (remainingTime > 0) {
                setTimeout(cleanup, remainingTime);
            } else {
                cleanup();
            }
        }
    }

    function updateStats(stats) {
        if (!statsContainer) return;

        statsContainer.innerHTML = '';
        const statsTitle = document.createElement('h3');
        statsTitle.textContent = 'Mode Usage Stats';
        statsContainer.appendChild(statsTitle);

        const statsList = document.createElement('ul');
        for (const mode in stats) {
            const statItem = document.createElement('li');
            statItem.textContent = `${mode}: ${stats[mode]}`;
            statsList.appendChild(statItem);
        }
        statsContainer.appendChild(statsList);
    }

    function updateAchievements(achievements) {
        if (!achievementsContainer) return;

        achievementsContainer.innerHTML = '';
        const achievementsTitle = document.createElement('h3');
        achievementsTitle.textContent = 'Achievements';
        achievementsContainer.appendChild(achievementsTitle);

        const achievementsList = document.createElement('ul');
        achievements.forEach(ach => {
            const achievementItem = document.createElement('li');
            achievementItem.textContent = `${ach.name} - ${ach.description} (${ach.unlocked ? 'Unlocked' : 'Locked'})`;
            achievementsList.appendChild(achievementItem);
        });
        achievementsContainer.appendChild(achievementsList);
    }

    window.addEventListener('message', event => {
        const message = event.data;

        if (message.type === 'updateStats') {
            updateStats(message.value);
        }

        if (message.type === 'updateAchievements') {
            updateAchievements(message.value);
        }

        if (message.type === 'toggleStats') {
            if (statsAndAchievementsContainer) {
                updateStats(message.value.stats);
                updateAchievements(message.value.achievements);
                const isVisible = statsAndAchievementsContainer.style.display === 'block';
                statsAndAchievementsContainer.style.display = isVisible ? 'none' : 'block';
            }
        }

        if (message.type === 'flipJoey') {
            
            if (character) {
                document.getElementById('character-wrapper')?.classList.toggle('flipped', message.value);
            }
        }

        if (message.type === 'achievementsUnlocked') {
            message.value.forEach(ach => {
                const achievementNotification = document.createElement('div');
                achievementNotification.className = 'achievement-notification';
                achievementNotification.textContent = `Achievement Unlocked: ${ach.name}!`;
                if(chatContainer) {
                    chatContainer.appendChild(achievementNotification);
                }
            });
        }

        try {
            if (message && message.value && message.value.message && typeof message.value.message.text === 'string') {
                const nestedData = JSON.parse(message.value.message.text);
                if (nestedData && typeof nestedData.request === 'string') {
                    const modeMatch = nestedData.request.match(/<slug>(.*?)<\/slug>/);
                    if (modeMatch && character) {
                        character.setAttribute('data-mode', modeMatch[1]);
                    }
                }
            }
        } catch (e) { /* Safely ignore */ }

        if (message.type === 'taskModeSwitched' && character) {
            character.setAttribute('data-mode', message.value.modeSlug);
        }

        const isApiReqStarted = message.type === 'message' && message.value && message.value.message && message.value.message.say === 'api_req_started';

        if (isApiReqStarted) {
            // logApiState('API request started');
            startThinkingAnimation();
        } else {
            stopThinkingAnimation();
        }

        if (chatContainer) {
            if (!isApiReqStarted && message.type === 'message' && message.value && message.value.message) {
                const rooMessage = message.value.message;
                if (rooMessage.type === 'ask' && (rooMessage.ask === 'tool' || rooMessage.ask === 'command')) {
                    let toolName = '';
                    if (rooMessage.ask === 'command') {
                        toolName = 'execute_command';
                    } else if (rooMessage.ask === 'tool' && typeof rooMessage.text === 'string') {
                        try {
                            const toolData = JSON.parse(rooMessage.text);
                            toolName = toolData ? toolData.tool : '';
                        } catch (e) {
                            console.error('Error parsing tool data:', e);
                        }
                    }

                    if (toolName) {
                        const category = getToolCategory(toolName);
                        const mode = character ? character.getAttribute('data-mode') : null;
                        const actionTriggers = { code: 'write', architect: 'read', debug: 'read', orchestrator: 'read', ask: 'read' };
                        if (mode === 'debug' && category === 'write') {
                            playActionAnimation('code');
                        } else if (mode && actionTriggers[mode] === category) {
                            playActionAnimation();
                        }
                    }
                }
            }

            if (message.type === 'taskModeSwitched') {
                const modeContainer = document.createElement('div');
                modeContainer.className = 'mode-container';
                const modeData = document.createElement('p');
                modeData.textContent = `Mode switched to ${message.value.modeSlug}`;
                modeContainer.appendChild(modeData);
                chatContainer.appendChild(modeContainer);
                if (character && !isActing) character.className = 'idle';
            } 
        }
    });

    if (statsAndAchievementsContainer) {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'close-button';
        closeButton.addEventListener('click', () => {
            statsAndAchievementsContainer.style.display = 'none';
        });
        statsAndAchievementsContainer.appendChild(closeButton);
        const clearAchievementsButton = document.createElement('button');
        clearAchievementsButton.textContent = 'Clear Achievements';
        clearAchievementsButton.addEventListener('click', () => {
            vscode.postMessage({ command: 'joey-sidekick.clearAchievements' });
        });
        statsAndAchievementsContainer.appendChild(clearAchievementsButton);
        statsAndAchievementsContainer.appendChild(clearAchievementsButton);

        const resetStatsButton = document.createElement('button');
        resetStatsButton.textContent = 'Reset Stats';
        resetStatsButton.addEventListener('click', () => {
            vscode.postMessage({ command: 'joey-sidekick.resetStats' });
        });
        statsAndAchievementsContainer.appendChild(resetStatsButton);

        const flipJoeyButton = document.createElement('button');
        flipJoeyButton.textContent = 'Flip Joey';
        flipJoeyButton.addEventListener('click', () => {
            vscode.postMessage({ command: 'joey-sidekick.flipJoey' });
        });
        statsAndAchievementsContainer.appendChild(flipJoeyButton);
    }

    // Initial state
    if (character) {
        character.className = 'idle';
        character.addEventListener('click', playJumpAnimation);
    }
}());