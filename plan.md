# Plan for Action Animations

This document outlines the plan to implement new "action" animations that will play when a write tool is used in the application.

## `media/main.js` Modifications

1.  **`animation_frame_rate` variable:** Add a variable at the top of the file to control the animation speed.
    ```javascript
    const animation_frame_rate = 200; // milliseconds
    ```
2.  **`actionAnimations` object:** Create an object to store the animation frames for each mode.
    ```javascript
    const actionAnimations = {
        code: ['action-code-1', 'action-code-2'],
        orchestrator: ['action-orchestrator-1', 'action-orchestrator-2'],
        architect: ['action-architect-1', 'action-architect-2', 'action-architect-3'],
        ask: ['action-ask-1', 'action-ask-2'],
        debug: ['action-debug-1', 'action-debug-2']
    };
    ```
3.  **`playActionAnimation` function:** Implement a new function to play the animation sequence for a given mode.
4.  **Tool Usage Detection:** Modify the `message` event listener to check for 'write' tools and trigger the animation.

## `media/main.css` Modifications

1.  **New CSS Classes:** Add CSS classes for each animation frame.
2.  **`background-position`:** Set the `background-position` for each class to display the correct sprite from `char-sprite-sheet.png`.

### Sprite Sheet Calculations (256px frames)

*   **code:** row 1, col 2-3 -> `background-position: -256px 0px;`, `background-position: -512px 0px;`
*   **orchestrator:** row 2, col 1-2 -> `background-position: 0px -256px;`, `background-position: -256px -256px;`
*   **architect:** row 3, col 1-3 -> `background-position: 0px -512px;`, `background-position: -256px -512px;`, `background-position: -512px -512px;`
*   **ask:** row 6, col 1-2 -> `background-position: 0px -1280px;`, `background-position: -256px -1280px;`
*   **debug:** row 7, col 1-2 -> `background-position: 0px -1536px;`, `background-position: -256px -1536px;`

## Workflow

```mermaid
graph TD
    A[Tool Used] --> B{Is it a 'write' tool?};
    B -- Yes --> C[Get Current Mode];
    C --> D[Call playActionAnimation(mode)];
    D --> E[Cycle Through Animation Frames];
    B -- No --> F[Do Nothing];