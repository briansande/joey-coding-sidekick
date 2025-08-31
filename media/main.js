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

    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent

        // Universal slug detection for all messages
        try {
            // Correctly access the nested text field inside message.value
            if (message && message.value && message.value.message && typeof message.value.message.text === 'string') {
                const nestedData = JSON.parse(message.value.message.text);
                if (nestedData && typeof nestedData.request === 'string') {
                    const modeMatch = nestedData.request.match(/<slug>(.*?)<\/slug>/);
                    if (modeMatch && character) {
                        const mode = modeMatch[1];
                        character.setAttribute('data-mode', mode);
                        character.className = 'idle';
                    }
                }
            }
        } catch (e) {
            // This is expected if the field is not a JSON string.
            // We can safely ignore these errors.
        }

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

            } else if (message.type === 'taskModeSwitched') {
                const modeContainer = document.createElement('div');
                modeContainer.className = 'mode-container';

                const modeData = document.createElement('p');
                modeData.textContent = `Mode switched to ${message.value.modeSlug}`;
                modeContainer.appendChild(modeData);

                chatContainer.appendChild(modeContainer);
                if (character) {
                    character.setAttribute('data-mode', message.value.modeSlug);
                    character.className = 'idle';
                }
            }
        }
    });

    // Initial state
    if (character) {
        character.className = 'idle';
        character.addEventListener('click', playJumpAnimation);
    }
}());