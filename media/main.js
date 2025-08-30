// @ts-check

// This script will be run in the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const chatContainer = document.getElementById('chat-container');

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
            }
        }
    });
}());