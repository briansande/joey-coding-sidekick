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

    const colors = {
        architect: '#FFD700', // Gold
        code: '#00BFFF',      // DeepSkyBlue
        debug: '#FF4500',     // OrangeRed
        ask: '#9370DB',       // MediumPurple
        orchestrator: '#32CD32' // LimeGreen
    };

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
            } else if (message.type === 'taskModeSwitched') {
                const modeContainer = document.createElement('div');
                modeContainer.className = 'mode-container';

                const modeData = document.createElement('p');
                modeData.textContent = `Mode switched to ${message.value.modeSlug}`;
                modeContainer.appendChild(modeData);

                chatContainer.appendChild(modeContainer);

                if (petContainer) {
                    const mode = message.value.modeSlug;
                    const color = colors[mode] || `#${Math.floor(Math.random()*16777215).toString(16)}`;
                    petContainer.style.backgroundColor = color;
                }
            }
        }
    });
}());