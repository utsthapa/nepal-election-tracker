// e2e/pages/SimulatorPage.js
export class SimulatorPage {
  constructor(page) {
    this.page = page;
    this.resetButton = page.getByRole('button', { name: /reset/i });
    this.exportButton = page.getByRole('button', { name: /export/i });
    this.seatsTotalText = page.getByText(/seats total/i);
    this.exportSeatsCsvOption = page.getByRole('button', { name: /seats summary/i });
  }

  async goto() {
    await this.page.addInitScript(() => {
      localStorage.setItem('hasSeenQuickStart', 'true');
    });
    await this.page.goto('/simulator');
    await this.page.waitForLoadState('networkidle');
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
}
