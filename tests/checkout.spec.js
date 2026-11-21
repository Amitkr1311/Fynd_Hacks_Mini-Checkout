const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('successful checkout shows one confirmation with customer, reference, and exact total', async ({ page }) => {
  await page.getByTestId('add-keyboard').click();
  await page.getByLabel('Customer Name').fill('Ada Lovelace');
  await page.getByRole('button', { name: 'Place Order' }).click();

  const confirmation = page.getByTestId('confirmation');
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toHaveCount(1);
  await expect(page.getByTestId('confirmation-name')).toHaveText('Customer: Ada Lovelace');
  await expect(page.getByTestId('confirmation-reference')).toContainText(/^Reference: ORD-\d{6}$/);
  await expect(page.getByTestId('confirmation-total')).toHaveText('Total: $80.00');
  await expect(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();
});

test('missing customer name blocks checkout and preserves the cart', async ({ page }) => {
  await page.getByTestId('add-hub').click();
  await page.getByLabel('Customer Name').fill('   ');
  await page.getByRole('button', { name: 'Place Order' }).click();

  await expect(page.getByTestId('form-error')).toBeVisible();
  await expect(page.getByTestId('form-error')).toHaveText('Customer name is required.');
  await expect(page.getByTestId('cart-item-hub')).toBeVisible();
  await expect(page.getByTestId('quantity-hub')).toHaveValue('1');
  await expect(page.getByTestId('confirmation')).toBeHidden();
});

test('quantity changes update both line totals and overall total exactly', async ({ page }) => {
  await page.getByTestId('add-keyboard').click();
  await page.getByTestId('add-hub').click();

  await page.getByTestId('quantity-keyboard').fill('3');
  await page.getByTestId('quantity-keyboard').press('Tab');
  await page.getByRole('button', { name: 'Increase USB-C Hub quantity' }).click();
  await page.getByRole('button', { name: 'Decrease USB-C Hub quantity' }).click();

  await expect(page.getByTestId('line-total-keyboard')).toHaveText('$240.00');
  await expect(page.getByTestId('line-total-hub')).toHaveText('$35.00');
  await expect(page.getByTestId('order-total')).toHaveText('$275.00');

  await page.getByRole('button', { name: 'Increase USB-C Hub quantity' }).click();
  await expect(page.getByTestId('line-total-hub')).toHaveText('$70.00');
  await expect(page.getByTestId('order-total')).toHaveText('$310.00');
});
