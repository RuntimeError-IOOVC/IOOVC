# Debate Bedrock

Local-first debate practice timer. Zero dependencies, no build step, no
accounts - open it, run a round, close it. All state lives in the browser's
`localStorage` and never leaves the device.

## Features

- WSDC and British Parliamentary speaking orders with official speech lengths
- Countdown timer with protected-time / POI-open indicator
- Speaking-order stepper: previous / next, or `Space` / `N` / `R` shortcuts
- Motion box that persists between sessions
- Light and dark themes (follows the system preference)

## Quick start

Any static file server works. Two zero-install options:

    # Python (preinstalled on macOS/Linux)
    python3 -m http.server 8000

    # or Node
    npx --yes serve .

Then open http://localhost:8000.

Note: opening index.html over file:// will not work, because the scripts are
ES modules and browsers block module loading from the file scheme.

## Tests

    npm test

Runs `node --test tests/` - plain Node 18+, no packages to install.
