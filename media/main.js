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

    const colors = {
        architect: '#FFD700', // Gold
        code: '#00BFFF',      // DeepSkyBlue
        debug: '#FF4500',     // OrangeRed
        ask: '#9370DB',       // MediumPurple
        orchestrator: '#32CD32' // LimeGreen
    };

    let talkState = 0;
    let talkInterval;
    let talkTimeout;

    let jumpAnimationTimeout;
    let periodicJumpInterval;
    let isJumping = false;

    function playJumpAnimation() {
        if (character && !isJumping) {
            isJumping = true;

            // 1. Temporarily disable the idle animation
            character.style.animation = 'none';

            // 2. Force browser to apply the style change (reflow)
            // @ts-ignore
            void character.offsetHeight;

            // 3. Now, start the jump animation
            character.className = 'jump-1';
            setTimeout(() => {
                // Frame 2
                character.className = 'jump-2';
                setTimeout(() => {
                    // Frame 3
                    character.className = 'jump-3';
                    setTimeout(() => {
                        // Back to idle
                        character.className = 'idle';
                        // 4. Remove the inline style so the CSS animation can resume
                        character.style.animation = '';
                        isJumping = false;
                    }, 300); // Duration of frame 3
                }, 500); // Duration of frame 2
            }, 600); // Duration of frame 1
        }
    }

    function startPeriodicJump() {
        if (periodicJumpInterval) {
            clearInterval(periodicJumpInterval);
        }
        periodicJumpInterval = setInterval(playJumpAnimation, 3000);
    }

    function stopPeriodicJump() {
        if (periodicJumpInterval) {
            clearInterval(periodicJumpInterval);
            periodicJumpInterval = null;
        }
        if (jumpAnimationTimeout) {
            clearTimeout(jumpAnimationTimeout);
        }
    }

    function startTalking() {
        stopPeriodicJump();
        if (talkInterval) {
            clearInterval(talkInterval);
        }
        if (talkTimeout) {
            clearTimeout(talkTimeout);
        }

        talkInterval = setInterval(() => {
            if (character) {
                talkState = 1 - talkState;
                character.className = talkState === 1 ? 'talking' : 'idle';
            }
        }, 100);

        talkTimeout = setTimeout(stopTalking, 2000);
    }

    function stopTalking() {
        if (talkInterval) {
            clearInterval(talkInterval);
            talkInterval = null;
        }
        if (character) {
            character.className = 'idle';
        }
        talkState = 0;
        startPeriodicJump();
    }

    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent

        if (chatContainer) {
            if (message.type === 'message') {
                const messageContainer = document.createElement('div');
                messageContainer.className = 'message-container';

                const messageData = document.createElement('pre');

                if (typeof message.value === 'string') {
                    messageData.textContent = message.value;
                } else {
                    messageData.textContent = JSON.stringify(message.value, null, 2);
                }

                messageContainer.appendChild(messageData);

                chatContainer.appendChild(messageContainer);
                startTalking();
            } else if (message.type === 'taskModeSwitched') {
                const modeContainer = document.createElement('div');
                modeContainer.className = 'mode-container';

                const modeData = document.createElement('p');
                modeData.textContent = `Mode switched to ${message.value.modeSlug}`;
                modeContainer.appendChild(modeData);

                chatContainer.appendChild(modeContainer);
            }
        }
    });

    // Initial state
    if (character) {
        character.className = 'idle';
    }
    startPeriodicJump();
}());