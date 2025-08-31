# Joey Coding Sidekick

A friendly coding sidekick for Visual Studio Code to keep you company while you work. Joey is an interactive pet that reacts to your coding activity, tracks your stats, and awards achievements.

## Features

*   **Interactive Pet:** A virtual pet that lives in your VS Code sidebar.
*   **Activity Tracking:** Joey gets bored when you're inactive and reacts when you're coding.
*   **Stats and Achievements:** Tracks your coding statistics and unlocks achievements based on your activity.
*   **Customizable:** Flip Joey's orientation and toggle achievement visibility.

## Installation

1.  Open **Visual Studio Code**.
2.  Go to the **Extensions** view (`Ctrl+Shift+X`).
3.  Search for `joey-coding-sidekick`.
4.  Click **Install**.

## Commands

You can access the following commands from the Command Palette (`Ctrl+Shift+P`):

*   `JOEY: Start New Roocode Task`: Starts a new task with Roocode.
*   `JOEY: Reset Stats`: Resets your coding statistics.
*   `JOEY: Flip Joey`: Flips Joey horizontally.
*   `JOEY: Show Stats`: Displays your current stats.
*   `JOEY: Clear Achievements`: Clears all your earned achievements.
*   `JOEY: Toggle Achievements`: Shows or hides achievement notifications.

## Configuration

You can configure the extension through the VS Code settings (`Ctrl+,`):

*   `joey-sidekick.flipped`: Set to `true` to flip Joey horizontally. (Default: `false`)
*   `joey-sidekick.debugMenu`: Set to `true` to show the debug menu in the sidebar. (Default: `false`)
*   `joey-sidekick.showAchievements`: Set to `false` to hide achievement notifications. (Default: `true`)

## Development

To get started with development:

1.  Clone the repository.
2.  Run `npm install` to install dependencies.
3.  Run `npm run watch` to compile and watch for changes.
4.  Press `F5` to open a new VS Code window with the extension loaded.

