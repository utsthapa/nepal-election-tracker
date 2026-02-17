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
    // Suppress the QuickStart modal by pre-setting localStorage
    await this.page.addInitScript(() => {
      localStorage.setItem('hasSeenQuickStart', 'true');
    });
    await this.page.goto('/simulator');
    await this.page.waitForLoadState('networkidle');
  }

  async clickReset() {
    await this.resetButton.click();
    // Brief wait for React re-render
    await this.page.waitForTimeout(300);
  }

  async openExportDropdown() {
    await this.exportButton.click();
  }

  async downloadSeatsCsv() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportSeatsCsvOption.click(),
    ]);
    return download;
  }
}
