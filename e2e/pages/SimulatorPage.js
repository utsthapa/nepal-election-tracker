// e2e/pages/SimulatorPage.js
export class SimulatorPage {
  constructor(page) {
    this.page = page;
    this.resetButton = page.getByRole('button', { name: /reset/i });
    this.exportButton = page.getByRole('button', { name: /export/i });
    this.seatsTotalText = page.getByText(/seats total/i);
    this.manualTab = page.getByRole('button', { name: 'Manual' });
    this.demographicsTab = page.getByRole('button', { name: 'Demographics' });
    this.advancedTab = page.getByRole('button', { name: 'Advanced' });
    this.lockButton = page.getByRole('button', { name: /sliders (locked|unlocked)/i });
    this.majorityIndicator = page.getByText(/majority|hung parliament/i).first();
    this.exportSeatsCsvOption = page.getByRole('button', { name: /seats summary/i });
  }

  /** Get the range input for a party by its aria-label (e.g. 'Nepali Congress vote share') */
  slider(ariaLabel) {
    return this.page.getByRole('slider', { name: ariaLabel }).first();
  }

  /** Read the current numeric value of a slider from its aria-valuetext attribute */
  async getSliderValue(ariaLabel) {
    const raw = await this.slider(ariaLabel).getAttribute('aria-valuenow');
    return parseFloat(raw);
  }

  /**
   * Set a React range-input slider to a specific value.
   * Uses the native HTMLInputElement value setter so React's synthetic event fires.
   */
  async setSlider(ariaLabel, value) {
    const sliderEl = this.slider(ariaLabel);
    await sliderEl.evaluate((el, val) => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeSetter.call(el, String(val));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
    // Give React one tick to recalculate seats
    await this.page.waitForTimeout(200);
  }

  /** Read the "Total X%" sum shown at the bottom of a slider panel.
   *  Scoped to the panel that contains the given party slider to avoid ambiguity. */
  async getSliderPanelTotal(ariaLabel) {
    const panel = this.page.locator('.bg-surface').filter({ has: this.slider(ariaLabel) });
    const text = await panel.locator('.font-mono').last().textContent();
    return parseInt(text, 10); // e.g. "100%" → 100
  }

  async goto() {
    await this.page.addInitScript(() => {
      localStorage.setItem('hasSeenQuickStart', 'true');
    });
    await this.page.goto('/simulator');
    await this.page.waitForLoadState('networkidle');
    // Dismiss the guided flow to reveal the full dashboard (Reset/Export buttons)
    const fullDashboardBtn = this.page.getByRole('button', { name: /use full dashboard/i });
    if (await fullDashboardBtn.isVisible()) {
      await fullDashboardBtn.click();
    }
  }

  async clickReset() {
    await this.resetButton.click();
    await this.seatsTotalText.waitFor({ state: 'visible' });
  }

  async openExportDropdown() {
    await this.exportButton.click();
  }

  async triggerSeatsCsvExport() {
    // App uses Blob URL downloads — Playwright's 'download' event won't fire.
    // Open dropdown, click the option, and verify dropdown closes (export ran).
    await this.openExportDropdown();
    await this.exportSeatsCsvOption.click();
    // Dropdown should close after export (setIsOpen(false) called in handleExport)
    await this.exportSeatsCsvOption.waitFor({ state: 'hidden' });
  }
  async clickTab(name) {
    await this.page.getByRole('button', { name }).click();
    await this.page.waitForTimeout(200);
  }
}
