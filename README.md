# Mini Checkout and Browser Test Suite

A self-contained vanilla HTML/CSS/JavaScript checkout demo with Playwright tests.

## Prerequisites

- Node.js 18 or newer
- npm

## Setup

```bash
npm install
npx playwright install chromium
```

## Run the app

```bash
npm start
```

Open `http://127.0.0.1:4173` (Vite also prints a local URL). If that port is occupied, stop the other process or start Vite on another port.

## Run browser tests

```bash
npm test
```

Playwright automatically starts the Vite server and runs the isolated Chromium tests in `tests/checkout.spec.js`.

## Test plan

See [TEST_PLAN.md](TEST_PLAN.md) for prioritized risks and manual verification results.
