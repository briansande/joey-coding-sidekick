// @ts-check

// This script will be run in the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const chatContainer = document.getElementById('chat-container');

    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent

        const eventContainer = document.createElement('div');
        eventContainer.className = 'event-container';

        const eventTitle = document.createElement('h3');
        eventTitle.textContent = message.type;
        eventContainer.appendChild(eventTitle);

        const eventData = document.createElement('pre');

        if (message.type === 'taskModeSwitched' && message.value && message.value.modeSlug) {
            eventData.textContent = `Mode switched to: ${message.value.modeSlug}`;
        } else {
            eventData.textContent = JSON.stringify(message.value, null, 2);
        }
        
        eventContainer.appendChild(eventData);

        chatContainer.appendChild(eventContainer);
    });
}());