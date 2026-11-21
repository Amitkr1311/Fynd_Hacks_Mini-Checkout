const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    viewport: { width: 1280, height: 800 }
  },
  webServer: {
    command: 'npm run start -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120_000
  }
});
