# Tasker 🎯

> *Sophisticated productivity. Playful rewards.*

**Tasker** is a gamified task management application designed to help you build habits through positive reinforcement. It combines a minimalist, premium aesthetic with RPG-like mechanics (XP, Levels, Coins) to make productivity satisfying.

![Tasker App](public/icons/icon-512x512.png)

## ✨ Features

- **Gamified Productivity**: Earn **Coins** and **XP** for every task you complete.
- **Level Up**: Progress through levels as you build consistency.
- **Rewards System**: Unlock **Scratch Cards** when you level up to win real-life rewards (e.g., "Cheat Meal", "30m Youtube").
- **Streaks**: Track your daily streaks for each task.
- **Undo Functionality**: Accidentally marked a task as done? Use the **Red Pill Undo** to revert it.
- **Minimalist Design**: A clean, sophisticated interface that focuses on your goals.
- **PWA Support**: Installable on mobile and desktop.
- **Internet Sharing**: Share your app instance with friends via a secure tunnel.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/S4m0502/tasker_Productivity-Tracker.git
    cd tasker_Productivity-Tracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Sharing Over Internet

To share your local instance with friends:

1.  Start the production server:
    ```bash
    npm run build && npm start
    ```

2.  In a new terminal, run the share script:
    ```bash
    npm run share
    ```

3.  Copy the provided URL (e.g., `https://shiny-dog-42.loca.lt`) and share it.
    *   **Note**: The password for the tunnel is your public IP address.

## 🛠️ Tech Stack

- **Framework**: [Next.js 12](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: CSS Modules / Global CSS Variables
- **PWA**: `next-pwa`
- **State Management**: React Context + LocalStorage

## 🔒 Privacy

All data is stored locally in your browser's `localStorage`. No data is sent to any external server.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
