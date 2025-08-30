// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { messages: [] };

    /** @type {Array<string>} */
    let messages = oldState.messages;

    updateMessageList(messages);

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'addMessage':
                {
                    messages.push(message.value);
                    updateMessageList(messages);
                    break;
                }
        }
    });

    function updateMessageList(messages) {
        const ul = document.querySelector('#message-list');
        ul.textContent = '';
        for (const message of messages) {
            const li = document.createElement('li');
            li.textContent = message;
            ul.appendChild(li);
        }

        // Update the saved state
        vscode.setState({ messages: messages });
    }
}());