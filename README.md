# Life Dashboard

A clean, personal browser dashboard built with pure HTML, CSS, and Vanilla JavaScript. No frameworks, no server — open `index.html` and go.

## Features

### MVP
| Feature          | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| **Clock & Date** | Live updating clock with day/date                                     |
| **Greeting**     | Time-based greeting (morning / afternoon / evening / night)           |
| **Focus Timer**  | 25-minute countdown with Start, Pause, Reset                          |
| **To-Do List**   | Add, edit, check off, and delete tasks — persisted in localStorage    |
| **Quick Links**  | One-click buttons to your favourite sites — persisted in localStorage |

### Challenges Implemented (all 5)
| Challenge                   | How                                                    |
| --------------------------- | ------------------------------------------------------ |
| **Light / Dark mode**       | Toggle button in the top bar; preference saved         |
| **Custom name in greeting** | Edit icon next to your name; saved to localStorage     |
| **Change Pomodoro time**    | Duration input below the timer; 1–120 minutes          |
| **Prevent duplicate tasks** | Warning shown if the same task text already exists     |

## File Structure

```
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Usage

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
2. Set your name with the ✏️ icon.
3. Add tasks and links — everything saves automatically.
4. Use the 🌙 / ☀️ button to toggle dark/light mode.

## Deployment (GitHub Pages)

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set source to **main** branch, **/ (root)** folder.
4. Your dashboard will be live at `https://<username>.github.io/<repo-name>/`.
