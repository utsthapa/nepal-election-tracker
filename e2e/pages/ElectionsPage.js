// e2e/pages/ElectionsPage.js
export class ElectionsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /elections/i }).first();
  }

  async goto() {
    await this.page.goto('/elections');
    await this.page.waitForLoadState('networkidle');
  }

  async getYearLinks() {
    // Links to individual election year pages, e.g. /elections/2022
    return this.page.getByRole('link', { name: /\b(19|20)\d{2}\b/ }).all();
  }

  async navigateToYear(year) {
    await this.page.goto(`/elections/${year}`);
    await this.page.waitForLoadState('networkidle');
  }
}
