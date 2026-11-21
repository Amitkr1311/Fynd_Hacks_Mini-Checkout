# Mini Checkout Test Plan

## Prioritized risks

| Priority | Risk | Coverage | Result |
|---|---|---|---|
| P0 | Inaccurate cents/totals or floating-point rounding | Verify line totals and order total after quantity edits | Automated quantity test |
| P0 | Double submission creates duplicate orders or changes reference | Rapid valid submission must create only one confirmation | Manual verification + disabled button guard |
| P1 | Empty cart bypasses checkout | Submit without items; require visible error | Manual verification |
| P1 | Missing or whitespace-only customer name bypasses validation | Submit with blank/whitespace name; require visible error | Automated required-field test |
| P2 | Validation errors destroy cart or customer input | Verify cart and input remain after blocked submission | Automated required-field test |
| P2 | Start New Order leaves stale submitted state | Reset cart, name, confirmation, and button | Manual spot check |

## Automated suite

Three Playwright tests cover successful checkout, missing-name validation, and exact quantity-driven totals. Tests start from a fresh page load and use visible text and deterministic test IDs.

## Manual Test Results

### A. Empty-cart checkout

- **Steps:** Start the app, leave the cart empty, enter `Manual Tester` in Customer Name, and click **Place Order**.
- **Expected:** Checkout is blocked; `Your cart is empty. Add at least one item.` is shown; no confirmation appears; entered name remains; cart stays empty.
- **Actual:** PASS. The submit handler blocked submission, displayed the exact empty-cart error, preserved the name, and rendered no confirmation.
- **Reproducible verification:** With the dev server running, open `/`, leave the cart empty, fill Customer Name, click Place Order, and inspect the alert and absence of the confirmation section.

### B. Rapid double-click valid order

- **Steps:** Add one Mechanical Keyboard, enter `Rapid Tester`, then issue two rapid clicks on **Place Order** (the second after the button becomes disabled).
- **Expected:** Exactly one confirmation section appears, the order reference is generated once and does not change, and Place Order remains disabled until Start New Order.
- **Actual:** PASS. The first submission immediately set the submitted guard and disabled the button; a rapid second click produced no additional confirmation or reference change.
- **Reproducible verification:** Open `/`, add a product, fill Customer Name, and double-click Place Order. Count `[data-testid="confirmation"]` elements (must be 1), save its reference, and verify the button is disabled.

## Manual execution log

| Date | Browser | Build | Cases | Result | Notes |
|---|---|---|---|---|---|
| 2026-11-21 | Headless Chromium (Playwright) | Local Vite app | Empty cart; rapid double-click | PASS | Verified using Playwright browser automation through the local app; no defects observed. |
